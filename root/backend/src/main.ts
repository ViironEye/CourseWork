import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { randomBytes } from 'crypto';
import { Logger } from '@nestjs/common';
import * as process from 'process';
import { aes } from './utils/crypto.util';

async function bootstrap() {
    const logger = new Logger(bootstrap.name);
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: '*',
        },
        logger: ['error', 'warn', 'log'],
    });
    await app.listen(4000);
    if (process.env.SECRET_TOKEN === 'change this') {
        randomBytes(64, (err, buf) => {
            logger.warn(`Update secret key: ${buf.toString('hex')}`);
        });
    }
}
bootstrap();
