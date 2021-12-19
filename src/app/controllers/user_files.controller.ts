import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserSafeInterceptor } from '../security/interceptors/user_safe.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileHelper } from 'src/app/utils/file_helper';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { UsersService } from '../services/core/user/users.service';

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
      limits: { fileSize: FileHelper.FILE_SIZE_MB_1 },
    }),
    UserSafeInterceptor,
  )
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const id = this.userService.userID(req);

    return await this.userService.updateImagePath(id, file.filename);
  }
}
