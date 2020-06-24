import { DynamicModule, Module, Global } from '@nestjs/common';

import { AlicloudOssConfig } from './interfaces/alicloud-oss-config.interface';
import { ALICLOUD_OSS_MODULE_CONFIG } from './alicloud-oss.constant';
import { AlicloudOssService } from './alicloud-oss.service';

@Global()
@Module({
  providers: [AlicloudOssService],
  exports: [AlicloudOssService],
})
export class AlicloudOssModule {
  public static withConfig(config: AlicloudOssConfig): DynamicModule {
    return {
      module: AlicloudOssModule,
      providers: [{ provide: ALICLOUD_OSS_MODULE_CONFIG, useValue: config }],
    };
  }
}
