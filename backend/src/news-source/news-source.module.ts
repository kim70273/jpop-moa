import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsSourceService } from './news-source.service';
import { NewsSourceController } from './news-source.controller';
import { NewsSource } from './entities/news-source.entity';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [TypeOrmModule.forFeature([NewsSource]), ArtistsModule],
  controllers: [NewsSourceController],
  providers: [NewsSourceService],
  exports: [NewsSourceService], // Export NewsSourceService for use in other modules
})
export class NewsSourceModule {}
