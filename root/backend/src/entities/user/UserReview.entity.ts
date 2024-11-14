import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User.entity';
import { Ads } from '../ads/Ads.entity';

@Entity('userReviews')
@ObjectType('userReviews')
export class UserReview extends BaseEntity {
    @Field()
    @PrimaryColumn('uuid')
    id: string;

    @Field()
    @Column({ default: false })
    edited: boolean;

    @Field()
    @Column({ type: 'bigint' })
    createdAt: number;

    @Field()
    @Column()
    text: string;

    @Field()
    @Column()
    rating: number;

    @Field((returns) => User)
    @ManyToOne(() => User, (user) => user.reviews)
    author: User;

    @Field((returns) => User)
    @ManyToOne(() => User, (_user) => _user.reviews, { onDelete: 'CASCADE' })
    user: User;
}
