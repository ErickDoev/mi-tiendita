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
        return new Promise(async(resolve, reject) => {
            const buffer = file.buffer;
            const base64Image = Buffer.from(buffer).toString('base64');
    
            cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
                folder: 'mi-tiendita',
                resource_type: 'image',
            },(error, result) => {
                if(error) {
                    reject(error);
                } else {
                    resolve({
                        secure_url: result.secure_url
                    });
                }
            },)
        })
     }
}