import { Options } from 'fastify-multer/lib/interfaces';
import { MulterField } from './interfaces';
export declare const FastifyFileFieldsInterceptor: (uploadFields: MulterField[], localOptions?: Options) => MethodDecorator & ClassDecorator;
