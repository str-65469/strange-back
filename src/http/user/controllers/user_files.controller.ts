import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { FileHelper } from 'src/helpers/file_helper';

@Controller('user/upload')
export class UserFileController {
  @Post('profile')
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './upload/user/profiles',
        filename: FileHelper.customFileName,
      }),

      fileFilter: FileHelper.imageFileFilter,
      limits: {
        fileSize: FileHelper.FILE_SIZE_MB_1,
      },
    }),
  )
  uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    return response;
  }
}
