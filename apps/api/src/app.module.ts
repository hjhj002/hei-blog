import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { AiModule } from './ai/ai.module';
import { MinioModule } from './minio/minio.module';
import { UploadModule } from './upload/upload.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    PostsModule,
    TagsModule,
    AiModule,
    MinioModule,
    UploadModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
