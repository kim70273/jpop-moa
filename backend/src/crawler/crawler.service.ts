import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  async fetchHtml(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
      this.logger.log(`Fetching HTML from: ${url}`);
      const { data } = await axios.get<string>(url); // Explicitly type data as string
      return cheerio.load(data);
    } catch (error: unknown) {
      // Explicitly type error as unknown
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch HTML from ${url}: ${error.message}`);
      } else {
        this.logger.error(
          `Failed to fetch HTML from ${url}: An unknown error occurred`,
        );
      }
      return null;
    }
  }
}
