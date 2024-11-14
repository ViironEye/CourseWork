import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AdsModule } from '../ads/ads.module';
import * as path from 'path';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { aes } from '../../utils/crypto.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from '../../guards/GQL.guard';
import { User } from '../../entities/user/User.entity';
import { BanEntity } from '../../entities/bans/Bans.entity';
import { TwoFaService } from '../auth/twoFa.service';
import { CdnModule } from '../cdn/cdn.module';
import { CdnService } from '../cdn/cdn.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ttl: 1,
                limit: 15,
                storage: new ThrottlerStorageRedisService({
                    host: config.getOrThrow<string>('REDIS_HOST'),
                    port: config.getOrThrow<number>('REDIS_PORT'),
                }),
            }),
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: true,
            autoTransformHttpErrors: true,
            context: async ({ req, res }) => ({
                req,
                res,
            }),
            include: [UserModule, AdsModule],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.getOrThrow<string>('DATABASE_HOST'),
                port: config.getOrThrow<number>('DATABASE_PORT'),
                username: config.getOrThrow<string>('DATABASE_USER'),
                password: config.getOrThrow<string>('DATABASE_PASSWORD'),
                database: config.getOrThrow<string>('DATABASE_NAME'),
                entities: [
                    path.join(
                        __dirname + '/../../entities/*/*.entity{.ts,.js}',
                    ),
                ],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => ({
                readyLog: true,
                config: {
                    host: conf.getOrThrow('REDIS_HOST'),
                    port: conf.getOrThrow('REDIS_PORT'),
                },
            }),
        }),
        AuthModule,
        UserModule,
        AdsModule,
        AppModule,
        CdnModule,
        TypeOrmModule.forFeature([User, BanEntity]),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        UserService,
        CdnService,
        JwtService,
        TwoFaService,
        {
            provide: APP_GUARD,
            useClass: GqlThrottlerGuard,
        },
    ],
})
export class AppModule {}
