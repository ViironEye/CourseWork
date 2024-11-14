import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Strategy } from 'passport-local';
import { User } from '../../entities/user/User.entity';
import HttpException from '../../exteptions/HttpException';
import { TwoFaService } from './twoFa.service';
import { AuthService } from './auth.service';

@Injectable()
export class UserAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private twoFaService: TwoFaService,
    ) {
        super({
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true,
            session: true,
        });
    }
    async validate(req, username, password, cb): Promise<any> {
        try {
            let user: User;
            if ((await this.userService.findUserByEmail(username)) != null)
                user = await this.userService.findUserByEmail(username);
            if ((await this.userService.findByUsername(username)) != null)
                user = await this.userService.findByUsername(username);
            if (!user)
                return cb(new HttpException(401, 'User not found'), false);
            const passValid = await this.authService.checkPassword(
                user.password,
                password,
            );
            if (!passValid)
                return cb(new HttpException(401, 'Password deny'), false);

            if (user.twofaConfirmed) {
                const twoFa = req.body.code;

                if (!twoFa)
                    return cb(new HttpException(400, 'TWOFA_REQUIRED'), false);

                const isTwoFaValid = await this.twoFaService.verifyKey(
                    user,
                    twoFa,
                );

                if (!isTwoFaValid)
                    return cb(new HttpException(400, 'TWOFA_INVALID'), false);
            }
            if (user.ban)
                return cb(new HttpException(403, 'USER_BANNED'), false);
            return cb(false, user);
        } catch (err) {
            return cb(err, false);
        }
    }
}
