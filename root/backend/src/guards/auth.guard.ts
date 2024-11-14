import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(AuthService) private authService: AuthService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const perms = this.reflector.get<string[]>(
            'perms',
            context.getHandler(),
        );
        if (!req.headers.authorization) return false;

        const user = await this.authService.getUser(req);
        if (!user) return false;

        (req as any).user = user;
        if (!perms) return true;
        if (perms[0] === 'NON_DEFAULT') return user.perms != 'default';
        return perms.includes(user.perms);
    }
}
