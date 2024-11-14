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
export class UserGuard implements CanActivate {
    constructor(
        @Inject(AuthService) private authService: AuthService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        if (!req.headers.authorization) return true;

        const user = await this.authService.getUser(req);
        if (!user) return true;

        (req as any).user = user;
        return true;
    }
}
