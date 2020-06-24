import { Inject, Injectable, Logger } from '@nestjs/common';

import * as OSS from 'ali-oss';

import { ALICLOUD_OSS_MODULE_CONFIG } from './alicloud-oss.constant';
import { AlicloudOssConfig, UploadedFileMetadata } from './interfaces';

@Injectable()
export class AlicloudOssService {
  private clients: { [key: string]: OSS } = {};
  private defaultClient: OSS;

  constructor(
    @Inject(ALICLOUD_OSS_MODULE_CONFIG)
    private readonly config: AlicloudOssConfig,
  ) {
    this.clients[config.options.bucket] = new OSS(config.options);
    this.defaultClient = this.clients[config.options.bucket];
    Logger.log('Alicloud OSS module initialized!', 'AlicloudOssModule');
  }

  async upload(file: UploadedFileMetadata, options?: OSS.PutObjectOptions): Promise<string> {
    try {
      if (file.bucket && !this.clients[file.bucket]) {
        const config = { ...this.config.options, bucket: file.bucket };
        this.clients[file.bucket] = new OSS(config);
      }

      const client = file.bucket ? this.clients[file.bucket] : this.defaultClient;
      const filename = file.customName ?? file.originalname;
      const path = file.folder ? `${file.folder}/${filename}` : filename;

      const uploadResponse = await client.put(path, file.buffer, options);
      file.url = uploadResponse.url;
      Logger.log(`Object "${filename}" uploaded successfully`, 'AlicloudOssModule');
      return file.url;
    } catch (err) {
      throw new Error(err);
    }
  }
}
