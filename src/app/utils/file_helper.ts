import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export class FileHelper {
  public static imagePath(img_path?: string) {
    // console.log(img_path);

    if (process.env.NODE_ENV === 'development') {
      //   console.log(img_path.startsWith('data:image'));

      //   if (img_path.startsWith('data:image')) {
      //     return img_path ?? null;
      //   }

      return img_path ?? null;
    }

    // for dicebear svg
    // if (img_path.startsWith('data:image')) {
    //   return img_path ?? null;
    // }

    return img_path ? process.env.APP_URL + '/upload' + img_path : null;
  }

  public static imageFileFilter(_, file, callback) {
    if (!file.originalname.match(/\.(jpeg)$/)) {
      return callback(new BadRequestException('Only JPEG image files are allowed !'), false);
    }

    callback(null, true);
  }

  public static customFileName(_, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const fileExtName = extname(file.originalname);
    const fileName = `${uniqueSuffix}.${fileExtName}`;

    callback(null, fileName);
  }

  public static profileImage(progileImageId: number) {
    return `${process.env.APP_URL}${this.profileImagePath(progileImageId)}`;
  }

  public static profileImagePath(progileImageId: number) {
    return `/public/static/11.24.1/img/profileicon/${progileImageId}.png`;
  }
}
