# nest-fastify-multer

## Install
```sh
npm i nest-fastify-multer
```
## External Dependency Packages

Before installing and using this package you must make sure you have `fastify-multer` installed.

```sh
npm i fastify-multer
```
You must configure this in the `main.js` of your Nest application.

```js
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { contentParser } from 'fastify-multer';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  await app.register(contentParser);
  await app.listen(3000);
}

bootstrap()
```

## Usage

```ts
import {
  Body,
  Controller,
  Post,
  Req, 
  UploadedFile,
} from '@nestjs/common';

// import the filters to use from the module.
import {
  FastifyFileInterceptor,
  FastifyFilesInterceptor,
  FastifyFileFieldsInterceptor,
} from 'nest-fastify-multer';

// import multer to use your methods
import { diskStorage } from 'multer';

@Controller('image')
export class ImageController {

  @Post('uploadFile')
  // use this interceptor to specify one file
  @FastifyFileInterceptor(
  // fileName
    'avatar',
  // here you can add any multer configuration.
   {
      storage: diskStorage({
        destination: './upload/single', // path where the file will be downloaded
        filename: editFileName, // here you can put your own function to edit multer file name when saving to local disk
      }),
      fileFilter: imageFileFilter, // here you can put your own function to filter the received files
    }
  )
  uploadFile(
    @Req() req: Request,
    // use this param decorator to capture the file. The file type Express.Multer.File is used as this is used.
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return file;
  }

  @Post('uploadFiles')
  // use this interceptor to specify more than one file
  @FastifyFilesInterceptor(
  // fileName
    'avatar',
  // maxCount  
     1,
  // here you can add any multer configuration.
   {
      storage: diskStorage({
        destination: './upload/single', // path where the file will be downloaded
        filename: editFileName, // here you can put your own function to edit multer file name when saving to local disk
      }),
      fileFilter: imageFileFilter, // here you can put your own function to filter the received files
    }
  )
  uploadFiles(
    @Req() req: Request,
    // use this param decorator to capture the files. The file type Express.Multer.File is used as this is used.
    @UploadedFile() files: Express.Multer.File[],
  ) {
    return files;
  }
  
  @Post('uploadFileFields')
  // use this interceptor to specify more than one field containing files
  @FastifyFileFieldsInterceptor(
  // specify here the array of field name and maximum number of files allowed in this field.  
    [{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }],
  // here you can add any multer configuration.
   {
      storage: diskStorage({
        destination: './upload/single', // path where the file will be downloaded
        filename: editFileName, // here you can put your own function to edit multer file name when saving to local disk
      }),
      fileFilter: imageFileFilter, // here you can put your own function to filter the received files
    }
  )
  uploadFileFields(
    @Req() req: Request,
    // use this param decorator to capture the files. The file type Express.Multer.File is used as this is used.
    @UploadedFile() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] },
  ) {
    return files;
  }

}
```
A possible implementation of the `editFileName` and `imageFileFilter` methods is provided.

```ts
import { extname } from 'path';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
```
