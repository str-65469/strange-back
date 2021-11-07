import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserSafeInterceptor } from '../interceptor/user_safe.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../services/users.service';
import { FileHelper } from 'src/app/helpers/file_helper';
import { Express } from 'express';
import { diskStorage } from 'multer';

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
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    const id = this.userService.userID();

    return await this.userService.updateImagePath(id, file.filename);
  }
}
