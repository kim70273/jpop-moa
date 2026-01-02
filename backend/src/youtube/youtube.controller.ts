import { Controller, Get, Logger } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  private readonly logger = new Logger(YoutubeController.name);

  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('trending-jpop')
  async getTrendingJpopVideos() {
    this.logger.log('GET /youtube/trending-jpop endpoint triggered');
    return this.youtubeService.getTrendingJpopVideos();
  }
}
