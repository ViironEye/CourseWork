import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard as AuthUserGuard } from '../../guards/auth.guard';
import { AuthService } from './auth.service';
import { User } from '../../entities/user/User.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {}
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Req() req, @Res() res) {
        const token = await this.authService.authorize(req.user.username, req);
        return res.send({
            ok: true,
            token: token,
        });
    }

    @Post('/register')
    async register(@Body() body, @Res() res: Response, @Req() req: Request) {
        await this.userService.createUser(body, req, res);
    }
    @UseGuards(AuthUserGuard)
    @Put('/logout')
    async logout(@Req() req, @Res() res) {
        const token = req.headers.authorization;
        if (!token) return res.status(403).send({ ok: false });

        const session = await this.authService.getSessionByHeaderToken(token);

        if (session) {
            this.authService.closeSession(session.uuid).then(() => {
                return res.send({ ok: true });
            });
        }
    }
    @UseGuards(AuthUserGuard)
    @Get('/sessions')
    async getSessions(@Req() req, @Res() res) {
        const sessions = await this.authService.getUserSessions(req);
        if (sessions) {
            return res.send({
                ok: true,
                sessions: sessions,
            });
        }
    }
}
