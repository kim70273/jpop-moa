import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NewsProcessorService } from './news-processor/news-processor.service';
import { performance } from 'perf_hooks';

// nest generate controller app (nest g co app)
// 컨트롤러는 url을 가져오고, 함수를 실행한다
// 컨트롤러는 url을 가져오는 역함, 서비스는 비즈니스 기능
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly newsProcessorService: NewsProcessorService,
  ) {}

  // Get과 같은 데코레이터는 바로아래에 꾸며주는 함수나 클래스가 있어야된다(한칸 더 띄우거나 하면 안됨)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-process-news')
  async testProcessNews() {
    const startTime = performance.now();
    await this.newsProcessorService.startProcessing();
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // Convert to seconds
    return `뉴스 처리 완료! 총 처리 시간: ${duration.toFixed(3)}초`;
  }
}
