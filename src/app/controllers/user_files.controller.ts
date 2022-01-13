import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserSafeInterceptor } from '../interceptors/user_safe.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileHelper } from 'src/app/utils/file.helper';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { UsersService } from '../modules/user/users.service';
import { configs } from 'src/configs/config';

@Controller('user/upload')
export class UserFileController {
  constructor(private readonly userService: UsersService) {}

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './upload/user/profiles',
        filename: FileHelper.customFileName,
      }),
      fileFilter: FileHelper.imageFileFilter,
      limits: { fileSize: configs.general.PROFILE_UPLOAD_FILE_SIZE_MAX },
    }),
    UserSafeInterceptor,
  )
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const id = this.userService.userID(req);

    return await this.userService.updateImagePath(id, file.filename);
  }
}
