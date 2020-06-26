jest.mock('ali-oss');
import * as OSS from 'ali-oss';

import { AlicloudOssService } from './alicloud-oss.service';
import { AlicloudOssConfig, UploadedFileMetadata } from './interfaces';

OSS.prototype.put = (path: string, ...args: any): any => {
  return {
    url: path,
  };
};

let ossService: AlicloudOssService = null;

describe('AlicloudOssService', () => {
  let buffer = Buffer.from('test');
  let file: UploadedFileMetadata;

  beforeEach(() => {
    const config: AlicloudOssConfig = {
      options: {
        accessKeyId: '****',
        accessKeySecret: '****',
        bucket: '****',
      },
    };

    file = {
      buffer,
      fieldname: 'file',
      originalname: 'test.txt',
      encoding: 'utf-8',
      mimetype: 'text/plain',
      size: buffer.length,

      url: null,
    };

    ossService = new AlicloudOssService(config);
  });

  it('should upload successfully when config is valid', async () => {
    const url = await ossService.upload(file);

    expect(url).toBe('test.txt');
    expect(file.url).toBe('test.txt');
  });

  it('should upload successfully when set custom filename', async () => {
    file.customName = 'custom name.txt';
    const url = await ossService.upload(file);

    expect(url).toBe('custom name.txt');
    expect(file.url).toBe('custom name.txt');
  });

  it('should upload successfully when set custom folder', async () => {
    file.folder = 'a/b/c';
    const url = await ossService.upload(file);

    expect(url).toBe('a/b/c/test.txt');
    expect(file.url).toBe('a/b/c/test.txt');
  });

  it('should upload successfully when set custom filename and folder', async () => {
    file.folder = 'a/b/c';
    file.customName = 'custom name.txt';
    const url = await ossService.upload(file);

    expect(url).toBe('a/b/c/custom name.txt');
    expect(file.url).toBe('a/b/c/custom name.txt');
  });
});
