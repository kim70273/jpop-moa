import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/entities/artist.entity';
import { DeepPartial } from 'typeorm';
import { ProcessedNews } from '../ai/interfaces/processed-news.interface';

// NotFoundException() 는 nestjs에서 제공하는 예외처리 클래스
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly artistsService: ArtistsService,
  ) {}

  async saveProcessedNews(processedNews: ProcessedNews): Promise<News> {
    const artist = await this.artistsService.findOrCreate(
      processedNews.artistName,
      processedNews.koreanArtistName,
    );

    // Check for existing news by sourceUrl to prevent duplicates
    const existingNews = await this.newsRepository.findOne({
      where: { sourceUrl: processedNews.sourceUrl },
    });

    const publishedAtDate =
      processedNews.publishedAt === 'Not Found'
        ? null
        : new Date(processedNews.publishedAt);

    if (existingNews) {
      // Update existing news
      existingNews.originalTitle = processedNews.originalTitle;
      existingNews.originalContent = processedNews.originalContent;
      existingNews.translatedTitle = processedNews.translatedTitle;
      existingNews.translatedContent = processedNews.translatedContent;
      existingNews.publishedAt = publishedAtDate;
      existingNews.category = processedNews.category;
      return this.newsRepository.save(existingNews);
    } else {
      // Create new news
      const newNews = this.newsRepository.create({
        originalTitle: processedNews.originalTitle,
        originalContent: processedNews.originalContent,
        translatedTitle: processedNews.translatedTitle,
        translatedContent: processedNews.translatedContent,
        publishedAt: publishedAtDate,
        sourceUrl: processedNews.sourceUrl,
        category: processedNews.category,
        artist: artist,
      } as DeepPartial<News>); // Explicitly cast to DeepPartial<News>
      return this.newsRepository.save(newNews);
    }
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const artist = await this.artistsService.findOrCreate(
      createNewsDto.artistName,
    );

    const newNews = this.newsRepository.create({
      originalTitle: createNewsDto.originalTitle,
      originalContent: createNewsDto.originalContent,
      translatedTitle: createNewsDto.translatedTitle,
      translatedContent: createNewsDto.translatedContent,
      publishedAt: new Date(createNewsDto.publishedAt),
      sourceUrl: createNewsDto.sourceUrl,
      category: createNewsDto.category,
      artist: artist,
    } as DeepPartial<News>); // Explicitly cast to DeepPartial<News>
    return this.newsRepository.save(newNews);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    artistId?: number,
    category?: string,
    search?: string,
    searchFields?: string,
  ): Promise<{ data: News[]; total: number }> {
    const baseWhere: FindOptionsWhere<News> = {};
    if (artistId) {
      baseWhere.artist = { id: artistId };
    }
    if (category) {
      baseWhere.category = category;
    }

    let where: FindManyOptions<News>['where'] = baseWhere;

    if (search && searchFields) {
      const searchCondition = ILike(`%${search}%`);
      const fields = searchFields.split(',');

      const searchClauses: FindOptionsWhere<News>[] = [];
      if (fields.includes('title')) {
        searchClauses.push({ ...baseWhere, translatedTitle: searchCondition });
      }
      if (fields.includes('content')) {
        searchClauses.push({
          ...baseWhere,
          translatedContent: searchCondition,
        });
      }

      if (searchClauses.length > 0) {
        where = searchClauses;
      }
    }

    const [data, total] = await this.newsRepository.findAndCount({
      where,
      relations: ['artist'],
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findLatest(limit: number): Promise<News[]> {
    return this.newsRepository.find({
      relations: ['artist'],
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async findBySourceUrl(sourceUrl: string): Promise<News | null> {
    return this.newsRepository.findOne({ where: { sourceUrl } });
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }

  async removeAll(): Promise<void> {
    await this.newsRepository.clear(); // Deletes all entries from the table
  }
}
