<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/nestjs-alicloud-oss"><img src="https://img.shields.io/npm/v/nestjs-alicloud-oss.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/nestjs-alicloud-oss"><img src="https://img.shields.io/npm/l/nestjs-alicloud-oss.svg" alt="Package License" /></a>
</p>

English | [简体中文](README-zh_CN.md)

## Description

[Alicloud OSS](https://www.aliyun.com/product/oss) module for [Nest](https://github.com/nestjs/nest) framework (node.js)

## Before Installation

1. Create Alicloud account
2. Purchase OSS. ([read more](https://www.aliyun.com/product/oss))
3. Create bucket, go to **Dashboard > Object Storage Service > Bucket List > Add Bucket**

## Installation

```bash
$ npm install --save nestjs-alicloud-oss
#or
$ yarn add nestjs-alicloud-oss
```

## Documentation

1. Import the `AlicloudOssModule` with the following configuration:

```typescript
import { Module } from '@nestjs/common';
import { AlicloudOssModule } from 'nestjs-alicloud-oss';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AlicloudOssModule.withConfig({
      options: {
        accessKeyId: '******',
        accessKeySecret: '******',
        region: '******', // the bucket data region location, doc demo used 'oss-cn-beijing'.
        bucket: '******', // the default bucket you want to access, doc demo used 'nest-alicloud-oss-demo'.
      },
    }),
  ],
})
export class AppModule {}
```

> You may provide a default `bucket` name for the whole module, this will apply to all controllers withing this module. You can also provide (override) the `bucket` in the controller, for each route.

## Examples

### Store a file using the default bucket

```typescript
import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AlicloudOssFileInterceptor, UploadedFileMetadata } from 'nestjs-alicloud-oss';

@Controller()
export class AppController {
  @Post('upload')
  @UseInterceptors(AlicloudOssFileInterceptor('file'))
  UploadedFileUsingInterceptor(
    @UploadedFile()
    file: UploadedFileMetadata,
  ) {
    console.log(file.objectUrl);
    // http://nest-alicloud-oss-demo.oss-cn-beijing.aliyuncs.com/filename
  }
}
```

### Store a file using a specific bucket and folder

```typescript
import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AlicloudOssFileInterceptor, UploadedFileMetadata } from 'nestjs-alicloud-oss';

@Controller()
export class AppController {
  @Post('upload2')
  @UseInterceptors(
    AlicloudOssFileInterceptor('file', null, {
      { folder: 'x/y/z', bucket: 'nest-alicloud-oss-demo2' },
    }),
  )
  UploadedFilesUsingInterceptor(
    @UploadedFile()
    file: UploadedFileMetadata,
  ) {
    console.log(file.objectUrl);
    // http://nest-alicloud-oss-demo2.oss-cn-beijing.aliyuncs.com/x/y/z/filename
  }
}
```

### Store a file using a custom filename and custom bucket

```typescript
import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlicloudOssService, UploadedFileMetadata } from 'nestjs-alicloud-oss';

@Controller()
export class AppController {
  constructor(private readonly ossService: AlicloudOssService) {}

  @Post('upload3')
  @UseInterceptors(FileInterceptor('file'))
  async UploadedFilesUsingService(
    @UploadedFile()
    file: UploadedFileMetadata,
  ) {
    file = {
      ...file,
      customName: 'customFilename.txt',
      folder: 'a/b/c'
      bucket: 'nest-alicloud-oss-demo3'
    };
    const url = await this.ossService.upload(file);

    console.log(url)
    // http://nest-alicloud-oss-demo3.oss-cn-beijing.aliyuncs.com/a/b/c/customFilename.txt

    console.log(file.objectUrl);
    // http://nest-alicloud-oss-demo3.oss-cn-beijing.aliyuncs.com/a/b/c/customFilename.txt
  }
}
```

### License

The [MIT](LICENSE) License.
