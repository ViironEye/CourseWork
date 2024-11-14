import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User as UUser } from '../../entities/user/User.entity';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const gqlCtx = GqlExecutionContext.create(ctx);
        const request = gqlCtx.getContext().req;

        return request.user as UUser;
    },
);
