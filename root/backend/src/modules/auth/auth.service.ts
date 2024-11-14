import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/User.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Session from './session';
import { v1 as uuid } from 'uuid';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { aes, md5 } from '../../utils/crypto.util';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRedis() private readonly client: Redis,
        @Inject(UserService) private userService: UserService,
        @Inject(ConfigService) private conf: ConfigService,
    ) {}

    async authorize(username: string, req: Request): Promise<string> {
        // окончание через неделю
        const user = await this.userService.findByUsername(username);
        const expires = Date.now() + 604800 * 1000;

        const session: Session = {
            uuid: uuid(),
            ip: req.headers['X-Real-IP']
                ? req.headers['X-Real-IP'].toString()
                : req.ip,
            ua: req.headers['user-agent'],
            expiresIn: expires,
            username,
            closed: false,
        };

        this.client.set(session.uuid, JSON.stringify(session));

        if (user) {
            user.sessions.push(session.uuid);

            await user.save();
        }

        return sign(
            { uuid: session.uuid },
            this.conf.getOrThrow('SECRET_TOKEN'),
            { expiresIn: Date.now() + 604800000 },
        );
    }

    async closeSession(uuid: string) {
        const session: Session = JSON.parse(await this.client.get(uuid));

        if (session) {
            const user = await this.userService.findByUsername(
                session.username,
            );
            user.sessions = user.sessions.filter(
                (_session) => _session != uuid,
            );

            this.client.del(session.uuid);
            await user.save();
        }
    }

    async getSession(uuid: string): Promise<Session> {
        return JSON.parse(await this.client.get(uuid));
    }

    async getSessionByHeaderToken(token: string): Promise<Session> {
        try {
            if (!token.includes('Bearer ')) return null;
            const data = token.split(' ')[1];
            const payload: any = verify(
                data,
                this.conf.getOrThrow('SECRET_TOKEN'),
            );
            const session = JSON.parse(await this.client.get(payload.uuid));
            if (!(await this.checkSSession(session))) return null;
            return session;
        } catch (e) {}

        return null;
    }

    async getSessionByToken(token: string): Promise<Session> {
        try {
            const payload: any = verify(
                token,
                this.conf.getOrThrow('SECRET_TOKEN'),
            );

            return JSON.parse(await this.client.get(payload.uuid));
        } catch (e) {}

        return null;
    }

    async getUserSessions(req: Request): Promise<Session[]> {
        const user = await this.getUser(req);
        const sessions: Session[] = [];

        for (const _uuid of user.sessions) {
            const _session = await this.client.get(_uuid);

            if (_session) {
                sessions.push(JSON.parse(_session));
            }
        }

        return sessions;
    }

    async checkSession(req: Request): Promise<boolean> {
        const session = await this.getSessionByHeaderToken(
            req.headers.authorization,
        );
        if (!session) return false;

        const user = await this.userService.findByUsername(session.username);
        if (session.ua != req.headers['user-agent']) return false;
        if (session.ip != req.ip) return false;
        if (session.closed) return false;
        if (Math.floor(session.expiresIn - Date.now()) < 0) {
            await this.closeSession(session.uuid);
            return false;
        }
        if (!user) {
            await this.closeSession(session.uuid);
            return false;
        }

        return true;
    }

    async checkSSession(session: Session): Promise<boolean> {
        const user = await this.userService.findByUsername(session.username);
        if (session.closed) return false;
        if (Math.floor(session.expiresIn - Date.now()) < 0) {
            await this.closeSession(session.uuid);
            return false;
        }
        if (!user) {
            await this.closeSession(session.uuid);
            return false;
        }

        return true;
    }

    async checkSessionByHeaderToken(token: string) {
        const session = await this.getSessionByHeaderToken(token);

        if (!session) return false;
        if (Math.floor(session.expiresIn - Date.now()) < 0) {
            await this.closeSession(session.uuid);
            return false;
        }

        return true;
    }

    async checkSessionByToken(token: string) {
        const session = await this.getSessionByToken(token);
        const user = await this.getUserByToken(token);

        if (!user) return false;
        if (!session) return false;
        if (Math.floor(session.expiresIn - Date.now()) < 0) {
            await this.closeSession(session.uuid);
            return false;
        }

        return true;
    }

    async getUser(req: Request) {
        const session = await this.getSessionByHeaderToken(
            req.headers.authorization,
        );
        if (session)
            return await this.userService.findByUsername(session.username);
        else return null;
    }

    async getUserByToken(token: string) {
        const session = await this.getSessionByToken(token);

        if (session) {
            return await this.userService.findByUsername(session.username);
        }
    }
    public async checkPassword(userPass: string, encryptedPassword: string) {
        const passwordHash = md5.hash(aes.decrypt(encryptedPassword));
        return userPass === passwordHash;
    }
}
