import { Controller, Post, Get, Res, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller()
export class UploadController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename(_ ,file, callback)
            {
                const randomName = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7);
                return callback(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async uploadFile(@UploadedFile() file)
    {
        const filePath = file.path.replace(`\\`, `/`);  //filepath started with '\\' instead of '/' so replace
        return {
            url: `http://localhost:3000/api/${filePath}`
        }
    }
    
    @Get('uploads/:imgPath')
    async getImage(
        @Param('imgPath') path: string,
        @Res() res: Response
        )
    {
        res.sendFile(path, {root: 'uploads'})
    }
    
}
