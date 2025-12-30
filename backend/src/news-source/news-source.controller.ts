import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { NewsSourceService } from './news-source.service';
import { CreateNewsSourceDto } from './dto/create-news-source.dto';
import { UpdateNewsSourceDto } from './dto/update-news-source.dto';
import type { Response } from 'express';

@Controller('news-source')
export class NewsSourceController {
  constructor(private readonly newsSourceService: NewsSourceService) {}

  @Post()
  create(@Body() createNewsSourceDto: CreateNewsSourceDto) {
    return this.newsSourceService.create(createNewsSourceDto);
  }

  @Get()
  findAll() {
    return this.newsSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsSourceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsSourceDto: UpdateNewsSourceDto,
  ) {
    return this.newsSourceService.update(+id, updateNewsSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsSourceService.remove(+id);
  }

  @Delete()
  async removeAll(@Res() res: Response) {
    await this.newsSourceService.removeAll();
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
