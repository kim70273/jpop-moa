import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsModule } from './artists/artists.module';
import { NewsModule } from './news/news.module';
import { CrawlerModule } from './crawler/crawler.module';
import { AiModule } from './ai/ai.module';
import { NewsSourceModule } from './news-source/news-source.module';
import { NewsProcessorModule } from './news-processor/news-processor.module';
import { ScheduleModule } from '@nestjs/schedule';
import { YoutubeModule } from './youtube/youtube.module';

// 이걸 데코레이터 라고하는데
// 클래스에 함수 기능을 추가할 수 있음.

// 만든 모든게 모듈에 들어간다고 생각하면됨.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available throughout the application
      envFilePath: '.env', // Specify the environment file name
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'jpop-moa'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // synchronize: true is not recommended for production.
        // It automatically creates the DB schema on every application launch.
        // Use migrations for production environments.
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(), // Add this line
    ArtistsModule,
    NewsModule,
    CrawlerModule,
    AiModule,
    NewsSourceModule,
    NewsProcessorModule,
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// AppModule 클래스가 빈값으로 되어있는데
// 위에 데코레이터에 imports, controllers, providers가 정의되어있음.
