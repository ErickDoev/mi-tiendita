import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFile(file: Express.Multer.File) {
        try {
            const buffer = file.buffer;
            const base64Image = Buffer.from(buffer).toString('base64');
    
            const url = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
                folder: 'mi-tiendita',
                resource_type: 'image',
            });
            
            return {
                secure_url: url.secure_url,
                created_at: url.created_at
            }
        } catch (error) {
            console.log(error);
        }
     }
}