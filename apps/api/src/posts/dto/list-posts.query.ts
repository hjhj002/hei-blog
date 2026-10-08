import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const toBoolean = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
};

export class ListPostsQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;

  @ApiPropertyOptional({ description: '按标题或正文搜索' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: '按标签 slug 过滤' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: '是否已发布' })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  published?: boolean;
}
