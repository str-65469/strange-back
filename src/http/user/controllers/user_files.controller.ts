import { UsersService } from 'src/http/user/users.service';
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { FileHelper } from 'src/helpers/file_helper';

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
      limits: {
        fileSize: FileHelper.FILE_SIZE_MB_1,
      },
    }),
  )
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    const userID = this.userService.userID();

    const updatedUser = await this.userService.updateImagePath(userID, file.filename);

    return { response, user: updatedUser };
  }
}
