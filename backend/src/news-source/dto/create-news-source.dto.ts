import { IsString, IsUrl } from 'class-validator';

export class CreateNewsSourceDto {
  @IsUrl()
  url: string;

  @IsString()
  artistName: string;
}
