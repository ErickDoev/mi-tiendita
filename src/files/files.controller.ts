import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter, filesFilter } from './helpers/fileFilter';
import { CloudinaryService } from './cloudinary.service';

@Controller('files')
export class FilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 1 * 1024 * 1024 }, 
    fileFilter,
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {
    if(!file) throw new BadRequestException('Make sure that the file is an image');
    return this.cloudinaryService.uploadFile(file);
  }

  @Post('product')
  @UseInterceptors(FilesInterceptor('images', 5, {
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter,
  }))
  uploadProductImages(
    @UploadedFiles() images: Express.Multer.File[]
  ) {    
    if(!images || images.length === 0) throw new BadRequestException('Make sure that the file is an image');
    return this.cloudinaryService.uploadManyFiles(images);
  }
  
}
