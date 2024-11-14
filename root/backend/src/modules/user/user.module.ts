import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResolver } from './user.resolver';
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
    controllers: [UserController],
    providers: [UserService, AuthService, UserResolver, TwoFaService],
})
export class UserModule {}
