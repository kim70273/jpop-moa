import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsSourceService } from '../news-source/news-source.service';
import { CrawlerService } from '../crawler/crawler.service';
import { AiService } from '../ai/ai.service';
import { NewsService } from '../news/news.service';
import { NewsSource } from '../news-source/entities/news-source.entity';
import { ProcessedNews } from '../ai/interfaces/processed-news.interface';

@Injectable()
export class NewsProcessorService {
  private readonly logger = new Logger(NewsProcessorService.name);
  private readonly BATCH_SIZE = 5; // Process 5 articles in parallel at a time

  constructor(
    private readonly newsSourceService: NewsSourceService,
    private readonly crawlerService: CrawlerService,
    private readonly aiService: AiService,
    private readonly newsService: NewsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Cron job: Starting news processing...');
    await this.startProcessing();
    this.logger.log('Cron job: News processing finished.');
  }

  async startProcessing() {
    this.logger.log('Starting news processing...');
    const newsSources = await this.newsSourceService.findAll();

    // Process all sources in parallel
    await Promise.all(newsSources.map((source) => this.processSource(source)));

    this.logger.log('News processing finished.');
  }

  async processSource(newsSource: NewsSource) {
    this.logger.log(`Processing news source: ${newsSource.url}`);
    try {
      if (newsSource.url.includes('ticket.melon.com')) {
        await this.processMelonTicketSource(newsSource);
      } else if (newsSource.url.includes('natalie.mu/music/news')) {
        await this.processNatalieMusicNewsSource(newsSource);
      } else {
        this.logger.warn(
          `Unsupported news source URL: ${newsSource.url}. Skipping.`,
        );
      }
      await this.newsSourceService.updateLastCrawledAt(newsSource.id);
      this.logger.log(`Finished processing news source: ${newsSource.url}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error processing news source ${newsSource.url}: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Error processing news source ${newsSource.url}: An unknown error occurred`,
          error,
        );
      }
    }
  }

  private async processNatalieMusicNewsSource(newsSource: NewsSource) {
    const $listPage = await this.crawlerService.fetchHtml(newsSource.url);
    if (!$listPage) {
      this.logger.error(
        `Failed to fetch news list page from ${newsSource.url}`,
      );
      return;
    }

    const articleLinks: string[] = [];
    $listPage('.NA_section-list .NA_card').each((i, element) => {
      const link = $listPage(element).find('a').attr('href');
      if (link) {
        const absoluteLink = new URL(link, newsSource.url).href;
        articleLinks.push(absoluteLink);
      }
    });

    this.logger.log(
      `Found ${articleLinks.length} articles on ${newsSource.url}`,
    );

    // Process articles in batches
    for (let i = 0; i < articleLinks.length; i += this.BATCH_SIZE) {
      const batch = articleLinks.slice(i, i + this.BATCH_SIZE);
      this.logger.log(`Processing batch of ${batch.length} articles...`);
      await Promise.all(
        batch.map((articleLink) => this.processSingleArticle(articleLink)),
      );
    }
  }

  private async processMelonTicketSource(newsSource: NewsSource) {
    this.logger.log(`Processing Melon Ticket source: ${newsSource.url}`);
    const $listPage = await this.crawlerService.fetchHtml(newsSource.url);
    if (!$listPage) {
      this.logger.error(
        `Failed to fetch Melon Ticket list page from ${newsSource.url}`,
      );
      return;
    }

    const elements = $listPage('.list_ticket_cont li').get();

    // Process melon ticket items in batches
    for (let i = 0; i < elements.length; i += this.BATCH_SIZE) {
      const batch = elements.slice(i, i + this.BATCH_SIZE);
      this.logger.log(`Processing batch of ${batch.length} melon tickets...`);
      await Promise.all(
        batch.map((element) => {
          const title = $listPage(element).find('.tit').text().trim();
          const artistName = $listPage(element).find('.txt_info').text().trim();
          const regDate = $listPage(element).find('.date').text().trim();
          const openDate = $listPage(element).find('.txt_date').text().trim();

          const simplifiedHtml = `
            <h1>${title}</h1>
            <p>아티스트: ${artistName}</p>
            <p>등록일: ${regDate}</p>
            <p>티켓 오픈 예정일: ${openDate}</p>
          `;
          const pseudoSourceUrl = `${newsSource.url}#${title}-${artistName}`;

          return this.processSingleArticle(
            pseudoSourceUrl,
            simplifiedHtml,
            regDate,
          );
        }),
      );
    }
  }

  private async processSingleArticle(
    sourceUrl: string,
    htmlContentOverride?: string,
    regDate?: string,
  ) {
    try {
      const existingNews = await this.newsService.findBySourceUrl(sourceUrl);
      if (existingNews) {
        this.logger.log(`News from ${sourceUrl} already exists. Skipping.`);
        return;
      }

      let htmlContent = htmlContentOverride;
      if (!htmlContent) {
        const $articlePage = await this.crawlerService.fetchHtml(sourceUrl);
        if (!$articlePage) {
          this.logger.error(`Failed to fetch article page from ${sourceUrl}`);
          return;
        }
        htmlContent = $articlePage.html();
      }

      const processedNews: ProcessedNews | null =
        await this.aiService.extractAndTranslateNews(htmlContent);

      if (!processedNews) {
        this.logger.error(`Failed to process news with AI for ${sourceUrl}`);
        return;
      }

      if (
        processedNews.artistName === 'Not Found' ||
        !processedNews.artistName
      ) {
        this.logger.log(
          `No artist identified for news from ${sourceUrl}. Skipping.`,
        );
        return;
      }

      processedNews.sourceUrl = sourceUrl;

      // Specific logic for Melon Ticket date override
      if (regDate && processedNews.publishedAt === 'Not Found') {
        const dateMatch = regDate.match(/(\d{4}\.\d{2}\.\d{2})/);
        if (dateMatch) {
          processedNews.publishedAt = dateMatch[1].replace(/\./g, '-');
        }
      }

      await this.newsService.saveProcessedNews(processedNews);
      this.logger.log(
        `Successfully processed and saved news from ${sourceUrl} for artist ${processedNews.artistName} (${processedNews.koreanArtistName})`,
      );
    } catch (error) {
      this.logger.error(`Error processing article ${sourceUrl}`, error);
    }
  }
}
