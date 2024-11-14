import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { Repository } from 'typeorm';
import { md5, aes } from '../../utils/crypto.util';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { v1 as uuid } from 'uuid';
import { Ads } from '../../entities/ads/Ads.entity';
import { User as usr } from '../../entities/user/User.entity';
import HttpException from '../../exteptions/HttpException';
import { TwoFaService } from '../auth/twoFa.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @Inject(JwtService) private jwt: JwtService,
        private twoFaService: TwoFaService,
    ) {}
    async findByUsername(username: string, user?: User) {
        return await this.repo.findOne({
            where: {
                username,
            },
            relations: ['ban'],
        });
    }
    async findUserByEmail(email: string) {
        return await this.repo.findOne({
            where: {
                email,
            },
            relations: ['ban'],
        });
    }
    async findUserById(id: string) {
        return await User.findOne({
            where: { id },
            relations: ['ads', 'ban'],
        });
    }
    public async createUser(body: any, req: Request, res: Response) {
        try {
            if ((await this.findUserByEmail(body.email)) != null)
                return res.status(400).send({ ok: false, code: 'EMAIL_BUSY' });

            if ((await this.findByUsername(body.username)) != null)
                return res
                    .status(400)
                    .send({ ok: false, code: 'USERNAME_BUSY' });
            const user = User.create({
                id: uuid(),
                username: body.username,
                password: md5.hash(aes.decrypt(body.password)),
                first_name: body.first_name,
                last_name: body.last_name,
                patronymic: body.patronymic,
                phone: body.phone,
                email: body.email,
                createdAt: Date.now(),
            });

            await user.save().then((_user: User) => {
                if (_user) {
                    return res.send({ ok: true });
                } else {
                    res.status(500).send({ ok: false });
                }
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ ok: false, error: e.message });
        }
    }
    async getUserAds(arg: string, usr?: User) {
        if (!arg) return null;
        const user = await this.repo.findOne({
            where: {
                id: arg != 'me' ? arg : usr != null ? usr.id : '',
            },
            relations: ['ads', 'ban'],
        });
        if (!user) return null;
        return user.ads && user.ads;
    }
}
