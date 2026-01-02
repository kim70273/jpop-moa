import { Controller, Get } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('trending-jpop')
  async getTrendingJpopVideos() {
    return this.youtubeService.getTrendingJpopVideos();
  }
}
