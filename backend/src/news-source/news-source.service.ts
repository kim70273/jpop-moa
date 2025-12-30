import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsSourceDto } from './dto/create-news-source.dto';
import { UpdateNewsSourceDto } from './dto/update-news-source.dto';
import { NewsSource } from './entities/news-source.entity';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/entities/artist.entity';

@Injectable()
export class NewsSourceService {
  constructor(
    @InjectRepository(NewsSource)
    private newsSourceRepository: Repository<NewsSource>,
    private readonly artistsService: ArtistsService,
  ) {}

  async updateLastCrawledAt(id: number): Promise<NewsSource> {
    const newsSource = await this.newsSourceRepository.findOne({
      where: { id },
    });
    if (!newsSource) {
      throw new NotFoundException(`NewsSource with ID ${id} not found`);
    }
    newsSource.lastCrawledAt = new Date();
    return this.newsSourceRepository.save(newsSource);
  }

  async create(createNewsSourceDto: CreateNewsSourceDto): Promise<NewsSource> {
    const artist = await this.artistsService.findOrCreate(
      createNewsSourceDto.artistName,
    );

    const newNewsSource = this.newsSourceRepository.create({
      url: createNewsSourceDto.url,
      artist: artist,
    });
    return this.newsSourceRepository.save(newNewsSource);
  }

  findAll(): Promise<NewsSource[]> {
    return this.newsSourceRepository.find({ relations: ['artist'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} newsSource`;
  }

  update(id: number, updateNewsSourceDto: UpdateNewsSourceDto) {
    return `This action updates a #${id} newsSource`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsSource`;
  }

  async removeAll(): Promise<void> {
    await this.newsSourceRepository.clear(); // Deletes all entries from the table
  }
}
