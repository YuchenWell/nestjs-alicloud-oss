<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/nestjs-alicloud-oss"><img src="https://img.shields.io/npm/v/nestjs-alicloud-oss.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/nestjs-alicloud-oss"><img src="https://img.shields.io/npm/l/nestjs-alicloud-oss.svg" alt="Package License" /></a>
</p>

[English](README.md) | 简体中文

## 描述

基于 [Nest](https://github.com/nestjs/nest)(node.js) 框架封装的 [阿里云对象存储 OSS](https://www.aliyun.com/product/oss) 模块。

## 安装前

1. 创建阿里云账号
2. 购买对象存储服务. ([产品链接](https://www.aliyun.com/product/oss))
3. 创建 Bucket, 到 **控制台 > 对象存储服务 > Bucket 列表 > 创建 Bucket**

## 安装

```bash
$ npm install --save nestjs-alicloud-oss
#or
$ yarn add nestjs-alicloud-oss
```

## 文档

1. 使用如下配置导入 `AlicloudOssModule`:

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
        region: '******', // bucket的地区, 下面的例子使用 'oss-cn-beijing'.
        bucket: '******', // 默认的 bucket, 面的例子使用 'nest-alicloud-oss-demo'.
      },
    }),
  ],
})
export class AppModule {}
```

> 你可以设置一个默认的`bucket` 来应用于整个应用的所有控制器 controller, 你也可以在在控制器的路由中重写 它，以使用不同的`bucket`。

## 例子

### 使用默认的 bucket 和第一级文件路径 来存储文件

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

### 使用自定义的 bucket 和文件路径 来存储文件

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

### 使用自定义的 文件名和 bucket 来存储文件

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
      folder: 'a/b/c',
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
