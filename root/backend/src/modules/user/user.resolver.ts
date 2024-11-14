import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../entities/user/User.entity';
import { User as usr } from './user.paramdecorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import UserProfileInput from './userProfile.input';
import { Ads } from '../../entities/ads/Ads.entity';
import { UserGuard } from '../../guards/user.guard';
import HttpException from '../../exteptions/HttpException';
import { TwoFaService } from '../auth/twoFa.service';

@Resolver((of) => User)
export class UserResolver {
    constructor(
        private userService: UserService,
        private twoFaService: TwoFaService,
    ) {}
    @Query((returns) => User, { nullable: true })
    async findUser(@Args('id') id: string) {
        return await this.userService.findUserById(id);
    }
    @UseGuards(AuthGuard)
    @Query((returns) => User, { nullable: true })
    async getMe(@usr() user: User) {
        return user;
    }

    @UseGuards(UserGuard)
    @Query((returns) => [Ads], { nullable: true })
    async getUserAds(@Args('id') id: string, @usr() user: User) {
        return await this.userService.getUserAds(id, user);
    }

    @UseGuards(UserGuard)
    @Query((returns) => [Ads], { nullable: true })
    async getUserFavorites(@usr() _user: User) {
        if (!_user) return null;
        const user = await User.findOne({
            where: {
                id: _user.id,
            },
            relations: ['favorites'],
        });
        return user.favorites;
    }
}
