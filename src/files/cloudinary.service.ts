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
    
            const url = await cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`, {
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

    async uploadManyFiles(images: Express.Multer.File[]) {
        try {
            const imagePromises = images.map(image => {
                try {
                    const buffer = image.buffer;
                    const base64Image = Buffer.from(buffer).toString('base64');

                    return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`, {
                        folder: 'mi-tiendita',
                        resource_type: 'image',
                        allowed_formats: ['jpg','png','gif']
                    })
                        .then(res => res.secure_url);
                } catch (error) {
                    console.log('ERROR :: ', error);
                    return null;
                }
            });

            const uploadedImages = await Promise.all(imagePromises);
            return uploadedImages;

        } catch (error) {
            console.log('ERROR2 :: ',error);
        }
    }
}