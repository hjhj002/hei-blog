import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostInput } from '@hei-blog/shared';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePostDto implements CreatePostInput {
  @ApiProperty({ example: '我的第一篇文章' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'my-first-post' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug 只能包含小写字母、数字与短横线',
  })
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string | null;

  @ApiProperty({ example: '# 正文' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ description: '封面图片 URL（来自 MinIO）' })
  @IsOptional()
  @IsString()
  coverImage?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiPropertyOptional({ type: [String], example: ['NestJS'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags?: string[];
}
