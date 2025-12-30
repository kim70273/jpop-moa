import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { ArtistsModule } from '../artists/artists.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    ArtistsModule,
    forwardRef(() => CrawlerModule), // Use forwardRef to resolve circular dependency
    forwardRef(() => AiModule), // Use forwardRef to resolve circular dependency
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService], // Export NewsService for use in other modules
})
export class NewsModule {}
