import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { CloudinaryService } from './cloudinary.service';

@Controller('files')
export class FilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('products')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if(!file) throw new BadRequestException('Make sure that the file is an image');
    return this.cloudinaryService.uploadFile(file);
  }
}
