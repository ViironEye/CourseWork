import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserReview } from '../../entities/user/UserReview.entity';

@Resolver()
export class UserReviewResolver {
    constructor(private userService: UserService) {}

    @Query((returns) => [UserReview], { nullable: true })
    async getUserReviews(@Args('id') id: string) {
        const reviews = await UserReview.find({
            where: {
                user: {
                    id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['author', 'user'],
        });
        if (!reviews) return null;
        return reviews.slice(0, 30);
    }
}
