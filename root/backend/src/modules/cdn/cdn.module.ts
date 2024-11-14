import { Module } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { CdnController } from './cdn.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TwoFaService } from '../auth/twoFa.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
    providers: [CdnService, AuthService, UserService, TwoFaService],
    controllers: [CdnController],
})
export class CdnModule {}
