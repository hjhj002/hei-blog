import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    const endPoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = Number(this.config.get('MINIO_PORT', 9000));
    const useSSL = this.config.get('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.config.get<string>('MINIO_ACCESS_KEY', '');
    const secretKey = this.config.get<string>('MINIO_SECRET_KEY', '');
    this.bucket = this.config.get<string>('MINIO_BUCKET', 'hei-blog');

    this.client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
    this.publicBaseUrl = `${useSSL ? 'https' : 'http'}://${endPoint}:${port}/${this.bucket}`;
  }

  async onModuleInit() {
    try {
      await this.ensureBucket();
    } catch (error) {
      this.logger.warn(`MinIO 初始化失败：${(error as Error).message}`);
    }
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
    await this.setPublicReadPolicy();
  }

  private async setPublicReadPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };
    await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const safeName = file.originalname.replace(/[^\w.\-]+/g, '_');
    const objectName = `${Date.now()}-${safeName}`;
    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
    return `${this.publicBaseUrl}/${objectName}`;
  }
}
