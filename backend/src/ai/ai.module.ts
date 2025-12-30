import { Module, forwardRef } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { CrawlerModule } from '../crawler/crawler.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [forwardRef(() => CrawlerModule), ConfigModule],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService], // Export AiService so it can be used by other modules
})
export class AiModule {}
