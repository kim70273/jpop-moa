import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly YOUTUBE_API_URL =
    'https://www.googleapis.com/youtube/v3/search';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getTrendingJpopVideos() {
    try {
      const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
      if (!apiKey) {
        this.logger.error('YOUTUBE_API_KEY is not configured.');
        throw new Error('YouTube API key is missing.');
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const params = {
        part: 'snippet',
        q: 'J-POP live',
        type: 'video',
        order: 'viewCount',
        maxResults: 5,
        key: apiKey,
        videoCategoryId: '10', // Music
        videoDuration: 'medium', // 4-20 minutes, to exclude shorts
        publishedAfter: sevenDaysAgo.toISOString(),
      };

      const response$ = this.httpService
        .get(this.YOUTUBE_API_URL, { params })
        .pipe(
          map((response) =>
            response.data.items.map((item) => ({
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnailUrl:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium?.url ||
                item.snippet.thumbnails.default.url,
            })),
          ),
        );

      return await firstValueFrom(response$);
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          'Error calling YouTube API:',
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        this.logger.error('An unexpected error occurred:', error);
      }
      throw error;
    }
  }
}
