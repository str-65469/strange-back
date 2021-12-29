import { HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { configs } from 'src/configs/config';
import { ExceptionMessageCode } from '../common/enum/message_codes/exception_message_code.enum';
import { GenericException } from '../common/exceptions/general.exception';
import { createUrl } from './url_builder';

export class FileHelper {
  public static imagePath(img_path?: string) {
    if (process.env.NODE_ENV === 'development') {
      return img_path ?? null;
    }

    // for dicebear svg
    if (img_path && img_path.startsWith('data:image')) {
      return img_path ?? null;
    }

    const upload = createUrl(configs.general.routes.APP_URL, { path: ['/upload', img_path ?? ''] });

    return img_path ? upload : null;
  }

  public static imageFileFilter(_, file, callback) {
    if (!file.originalname.match(/\.(jpeg)$/)) {
      return callback(new GenericException(HttpStatus.BAD_REQUEST, ExceptionMessageCode.ONLY_JPEG_ALLOWED), false);
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
    return createUrl(configs.general.routes.APP_URL, {
      path: this.profileImagePath(progileImageId),
    });
  }

  public static profileImagePath(progileImageId: number) {
    return `/public/static/11.24.1/img/profileicon/${progileImageId}.png`;
  }
}
