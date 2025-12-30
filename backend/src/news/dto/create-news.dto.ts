import { IsString, IsUrl, IsDateString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  originalTitle: string;

  @IsString()
  originalContent: string;

  @IsString()
  translatedTitle: string;

  @IsString()
  translatedContent: string;

  @IsDateString()
  publishedAt: string;

  @IsUrl()
  sourceUrl: string;

  @IsString()
  category: string;

  @IsString()
  artistName: string; // Changed from artistId to artistName
}
