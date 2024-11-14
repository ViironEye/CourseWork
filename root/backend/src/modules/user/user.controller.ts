import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Perms } from '../auth/perm.decorator';
import { Perm } from '../../enums/perm';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../entities/user/User.entity';
import HttpException from '../../exteptions/HttpException';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BanEntity } from '../../entities/bans/Bans.entity';
import { v1 } from 'uuid';
import { TwoFaService } from '../auth/twoFa.service';
import { aes, md5 } from '../../utils/crypto.util';
import { UserGuard } from '../../guards/user.guard';
import { User as UserParam } from '../user/user.paramdecorator';
import { UserService } from './user.service';
import { UserReview } from '../../entities/user/UserReview.entity';

@Controller('user')
export class UserController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        private readonly userService: UserService,
        private twoFaService: TwoFaService,
        @InjectRedis() private readonly client: Redis,
    ) {}

    @Perms(Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Get('/:id')
    async userInfo(@Param('id') id: string): Promise<User> {
        return await User.findOne({
            where: {
                id: id,
            },
            relations: ['ban'],
        });
    }

    @UseGuards(AuthGuard)
    @Patch('/update')
    async userProfileUpdate(
        @Req() req,
        @Res() res,
        @Body() body,
        @UserParam() user: User,
    ) {
        try {
            if (user.twofaConfirmed) {
                const twoFa = body.code;

                if (!twoFa)
                    return res.send(new HttpException(400, 'TWOFA_REQUIRED'));

                const isTwoFaValid = await this.twoFaService.verifyKey(
                    user,
                    twoFa,
                );

                if (!isTwoFaValid)
                    return res.send(new HttpException(400, 'TWOFA_INVALID'));
            }
            if (
                user.email !== body.email &&
                (await this.userService.findUserByEmail(body.email))
            )
                return res.status(400).send({ ok: false, code: 'EMAIL_BUSY' });

            if (
                user.username !== body.username &&
                (await this.userService.findByUsername(body.username))
            )
                return res
                    .status(400)
                    .send({ ok: false, code: 'USERNAME_BUSY' });

            user.email = body.email;
            user.username = body.username;
            user.phone = body.phone;
            user.link_vk = body.link_vk;
            user.first_name = body.last_name;
            user.last_name = body.last_name;
            user.patronymic = body.patronymic;
            await user.save();

            return res.send({
                ok: true,
            });
        } catch (e) {
            return res.send({
                ok: false,
                error: e,
            });
        }
    }
    @UseGuards(AuthGuard)
    @Perms(Perm.ADMIN)
    @Patch('/:id/edit')
    async userEdit(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
    ) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
            });
            if (!user) return res.send(new HttpException(400, 'USER_NOTFOUND'));
            if (
                user.email !== body.email &&
                (await this.userService.findUserByEmail(body.email))
            )
                return res.status(400).send({ ok: false, code: 'EMAIL_BUSY' });

            if (
                user.username !== body.username &&
                (await this.userService.findByUsername(body.username))
            )
                return res
                    .status(400)
                    .send({ ok: false, code: 'USERNAME_BUSY' });

            user.email = body.email;
            user.username = body.username;
            user.phone = body.phone;
            user.link_vk = body.link_vk;
            user.first_name = body.last_name;
            user.last_name = body.last_name;
            user.patronymic = body.patronymic;
            user.perms = body.perms;
            await user.save();

            return res.send({
                ok: true,
            });
        } catch (e) {
            return res.send({
                ok: false,
                error: e,
            });
        }
    }

    @UseGuards(UserGuard)
    @Post('/:id/review')
    async userReviewCreate(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
        @UserParam() UUser: User,
    ) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
                relations: ['reviews', 'reviews.user'],
            });
            const _user = await User.findOne({
                where: {
                    id: UUser.id,
                },
                relations: ['reviews', 'reviews.user'],
            });
            if (!user)
                return res.send(new HttpException(401, 'User not found'));
            const review = UserReview.create({
                id: v1(),
                createdAt: Date.now(),
                rating: body.rating,
                text: body.text,
                author: _user,
                user: user,
            });
            await review.save();
            user.reviews.push(review);
            const rate =
                Math.round(
                    (user.reviews
                        .map((review) => review.rating)
                        .reduce((v, c) => c + v, 0) /
                        user.reviews.length) *
                        100,
                ) / 100;

            user.rating = rate >= 5 ? 5 : rate;

            await user.save();
            await _user.save();
            delete review.user;
            return res.send({
                ok: true,
                review: {
                    ...review,
                    author: {
                        id: review.author.id,
                        username: review.author.username,
                        email: review.author.email,
                    },
                },
                rating: user.rating,
            });
        } catch (e) {
            console.log(e);
            return res.send({
                ok: false,
                error: e,
            });
        }
    }

    @Perms(Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Delete('/:id/review/:reviewId')
    async userReviewDelete(
        @Param('id') userId: string,
        @Param('reviewId') reviewId: string,
        @Req() req,
        @Res() res,
    ) {
        try {
            const user = await User.findOne({
                where: {
                    id: userId,
                },
                relations: ['reviews', 'reviews.user'],
            });
            if (!user)
                return res.send(new HttpException(401, 'User not found'));
            const review = await UserReview.findOne({
                where: {
                    id: reviewId,
                },
                relations: ['user', 'user.reviews'],
            });
            if (!review) return null;
            if (user.reviews.length > 0) {
                const rate =
                    Math.round(
                        (user.reviews
                            .map((comment) => comment.rating)
                            .reduce((v, c) => c + v, 0) /
                            user.reviews.length) *
                            100,
                    ) / 100;
                user.rating = !isNaN(rate) ? (rate >= 5 ? 5 : rate) : 0;
                await review.remove();
                await user.save();
                return res.send({
                    ok: true,
                    rating: user.rating,
                });
            } else {
                user.rating = 0;
                await user.save();
                return res.send({
                    ok: true,
                    rating: user.rating,
                });
            }
        } catch (e) {
            console.log(e);
            return res.send({
                ok: false,
                error: e.toString(),
            });
        }
    }

    @Perms(Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Get('/:id/sessions')
    async userInfoSessions(@Param('id') id: string): Promise<any> {
        const user = await User.findOneBy({ id });
        if (!user) return new HttpException(403);

        const sessions = [];

        for (const session of user.sessions) {
            const rSession = await this.client.get(session);

            if (rSession != null) sessions.push(JSON.parse(rSession));
        }

        return {
            ok: true,
            sessions,
        };
    }
    @Perms(Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Put('/:id/ban')
    async userBan(@Param('id') id: string, @Body() body: any): Promise<any> {
        const user = await User.findOneBy({ id });
        if (!user) return new HttpException(404);
        if (user.perms === Perm.ADMIN) return new HttpException(403);

        const ban = BanEntity.create({
            uuid: v1(),
            createdAt: Date.now(),
            user: user,
        });

        await ban.save();

        for (const session of user.sessions) {
            if (session) await this.authService.closeSession(session);
        }

        return {
            ok: true,
            ban,
        };
    }

    @Perms(Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Put('/:id/unban')
    async userUnBan(@Param('id') id: string, @Body() body: any): Promise<any> {
        const user = await User.findOne({
            where: {
                id,
            },
            relations: ['ban'],
        });
        if (!user) return new HttpException(404);
        if (!user.ban) return new HttpException(400);

        await user.ban.remove();

        return {
            ok: true,
        };
    }
    @UseGuards(AuthGuard)
    @Put('/twofa/create')
    async twoFaCreate(@Req() req, @Res() res) {
        const user = req.user as User;
        if (user.twofaConfirmed) return res.send({ ok: false });

        const data = await this.twoFaService.generateSecret(user);
        delete data.qr;

        if (data) return res.send({ ok: true, ...data });
    }

    @UseGuards(AuthGuard)
    @Post('/twofa/verify')
    async twoFaVerify(
        @Req() req,
        @Res() res,
        @Body('code') code: string,
        @Body('password') password: string,
    ) {
        const user = req.user as User;

        if (!code || !password) return res.status(400).send({ ok: false });
        if (user.twofaConfirmed) return res.send({ ok: false });

        const passVerify = md5.verify(
            aes.decrypt(req.body.password),
            user.password,
        );

        if (!passVerify)
            return res
                .status(400)
                .send({ ok: false, code: 'AUTH_PASSWORD_DENY' });

        const verify = await this.twoFaService.verifyKey(user, req.body.code);

        if (verify) {
            user.twofaConfirmed = true;

            await user.save().then(() => {
                return res.send({ ok: true });
            });
        } else {
            return res.status(400).send({ ok: false, code: 'TWOFA_INVALID' });
        }
    }

    @UseGuards(AuthGuard)
    @Post('/twofa/remove')
    async twoFaRemove(@Req() req, @Res() res, @Body('code') code: string) {
        const user = req.user as User;

        if (!code) return res.status(400).send({ ok: false });
        if (!user.twofaConfirmed) return res.send({ ok: false });

        const verify = await this.twoFaService.verifyKey(user, req.body.code);

        if (verify) {
            user.twofaConfirmed = false;
            user.twofa = null;
            await user.save().then(() => {
                return res.send({ ok: true });
            });
        } else {
            return res
                .status(400)
                .send(new HttpException(400, 'TWOFA_INVALID'));
        }
    }
    @UseGuards(AuthGuard)
    @Patch('/password')
    async passwordChange(
        @Req() req,
        @Res() res,
        @Body('code') code: string,
        @Body('oldPassword') oldPass: string,
        @Body('password') pass: string,
        @UserParam() user: User,
    ) {
        if (!oldPass)
            return res.send(new HttpException(400, 'PASSWORD_REQUIRED'));

        if (pass && aes.decrypt(pass) === aes.decrypt(oldPass))
            return res.send(new HttpException(400, 'OLDPASSWORD_MATCH'));

        if (!md5.verify(aes.decrypt(oldPass), user.password))
            return res.send(new HttpException(400, 'AUTH_PASSWORD_DENY'));

        if (user.twofaConfirmed) {
            if (!code)
                return res.send(new HttpException(400, 'TWOFA_REQUIRED'));

            const verify = this.twoFaService.verifyKey(user, code);

            if (!verify) {
                return res.send(new HttpException(400, 'TWOFA_INVALID'));
            }
        }
        user.password = md5.hash(pass);

        user.save().then(() => {
            return res.send({
                ok: true,
            });
        });
    }
}
