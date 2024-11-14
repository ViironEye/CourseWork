import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Ads } from '../../entities/ads/Ads.entity';
import { AdsResolver } from './ads.resolver';
import { TwoFaService } from '../auth/twoFa.service';
import { UserReviewResolver } from '../user/userReview.resolver';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Ads]),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('SECRET_TOKEN'),
                    signOptions: { expiresIn: '7d' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AdsController],
    providers: [
        AdsService,
        AuthService,
        UserService,
        UserReviewResolver,
        AdsResolver,
        TwoFaService,
    ],
})
export class AdsModule {}
