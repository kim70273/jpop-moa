import { Module } from '@nestjs/common';
import { NewsProcessorService } from './news-processor.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsSourceModule } from '../news-source/news-source.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { AiModule } from '../ai/ai.module';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NewsSourceModule,
    CrawlerModule,
    AiModule,
    NewsModule,
  ],
  providers: [NewsProcessorService],
  exports: [NewsProcessorService], // Export the service
})
export class NewsProcessorModule {}
