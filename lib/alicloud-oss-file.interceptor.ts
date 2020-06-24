import { NestInterceptor, Injectable, Type, ExecutionContext, CallHandler, Logger, mixin } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable } from 'rxjs';

import { PutObjectOptions } from 'ali-oss';
import { AlicloudOssService } from './alicloud-oss.service';

export function AlicloudOssFileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
  fileOptions?: { bucket?: string; folder?: string },
  ossOptions?: Partial<PutObjectOptions>,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    interceptor: NestInterceptor;

    constructor(private readonly ossService: AlicloudOssService) {
      this.interceptor = new (FileInterceptor(fieldName, localOptions))();
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      (await this.interceptor.intercept(context, next)) as Observable<any>;

      const request = context.switchToHttp().getRequest();
      const file = request[fieldName];

      if (!file) {
        Logger.warn(
          'AlicloudOssFileInterceptor',
          `Can not intercept field "${fieldName}". Did you specify the correct field name in @AlicloudOssFileInterceptor('${fieldName}')?`,
        );
        return next.handle();
      }

      if (fileOptions?.bucket) file.bucket = fileOptions.bucket;
      if (fileOptions?.folder) file.folder = fileOptions.folder;

      const objectUrl = await this.ossService.upload(file, ossOptions);
      file.objectUrl = objectUrl;
      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
