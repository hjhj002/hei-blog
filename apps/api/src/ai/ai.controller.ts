import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';

// 必须显式声明路由前缀：AppController 已占用根路径 `GET /api`，
// 若这里使用空前缀，两个控制器会注册到同一路由，后注册者会被静默覆盖。
@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  @ApiOperation({ summary: 'AI 模块健康检查' })
  getHello(): string {
    return this.aiService.getHello();
  }
}
