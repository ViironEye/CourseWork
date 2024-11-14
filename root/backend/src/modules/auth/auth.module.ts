import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TwoFaService } from './twoFa.service';
import { UserAuthStrategy } from './local.strategy';

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
    controllers: [AuthController],
    providers: [AuthService, UserService, UserAuthStrategy, TwoFaService],
})
export class AuthModule {}
