import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Inject,
  forwardRef,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CrawlerService } from '../crawler/crawler.service';
import { AiService } from '../ai/ai.service';
import type { Response } from 'express';
import { News } from './entities/news.entity';
import { ProcessedNews } from '../ai/interfaces/processed-news.interface';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    @Inject(forwardRef(() => CrawlerService))
    private readonly crawlerService: CrawlerService,
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService,
  ) {}

  @Post('process')
  async processNews(@Body('url') url: string, @Res() res: Response) {
    if (!url) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'URL is required' });
    }

    const $ = await this.crawlerService.fetchHtml(url);

    if (!$) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to fetch or parse HTML' });
    }

    const htmlContent = $.html();

    const processedNews: ProcessedNews | null =
      await this.aiService.extractAndTranslateNews(htmlContent);

    if (!processedNews) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to process or translate news with AI' });
    }

    // Check if artistName was identified by AI
    if (processedNews.artistName === 'Not Found' || !processedNews.artistName) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'No artist identified in the news article.' });
    }

    try {
      const savedNews = await this.newsService.saveProcessedNews(processedNews);
      return res.status(HttpStatus.CREATED).json(savedNews);
    } catch (error: unknown) {
      // Explicitly type error as unknown
      if (error instanceof Error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to save news to database',
          error: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to save news to database',
          error: 'An unknown error occurred',
        });
      }
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('artistId') artistId?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('searchFields') searchFields?: string,
  ): Promise<{ data: News[]; total: number }> {
    return this.newsService.findAll(
      +page,
      +limit,
      artistId,
      category,
      search,
      searchFields,
    );
  }

  @Get('latest')
  async findLatest(@Query('limit') limit = 5): Promise<News[]> {
    return this.newsService.findLatest(+limit);
  }

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }

  @Delete()
  async removeAll(@Res() res: Response) {
    await this.newsService.removeAll();
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
