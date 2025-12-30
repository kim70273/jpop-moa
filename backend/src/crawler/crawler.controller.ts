import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import type { Response } from 'express';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('fetch')
  async fetchUrl(@Body('url') url: string, @Res() res: Response) {
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

    const title = $('title').text();
    const h1Count = $('h1').length;

    return res.status(HttpStatus.OK).json({
      url,
      title,
      h1Count,
      message: 'HTML fetched and parsed successfully',
    });
  }
}
