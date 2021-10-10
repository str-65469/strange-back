import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export class FileHelper {
  public static readonly FILE_SIZE_MB_1 = 1150000; // ~1.1mb (1048576 - exactly 1mb)

  static imageFileFilter(_, file, callback) {
    if (!file.originalname.match(/\.(jpeg)$/)) {
      return callback(new BadRequestException('Only JPEG image files are allowed !'), false);
    }

    callback(null, true);
  }

  static customFileName(_, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname);
    const fileName = `${uniqueSuffix}.${fileExtName}`;

    callback(null, fileName);
  }
}
