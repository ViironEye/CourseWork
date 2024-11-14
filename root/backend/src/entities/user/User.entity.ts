import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Perm } from '../../enums/perm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BanEntity } from '../bans/Bans.entity';
import { Ads } from '../ads/Ads.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { UserReview } from './UserReview.entity';

@Entity('users')
@ObjectType('users')
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    password: string;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;

    @Field()
    @Column()
    patronymic: string;

    @Field()
    @Column()
    phone: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    link_vk: string;

    @Field()
    @Column({ default: 0 })
    number_of_ads: number;

    @Field()
    @Column({ type: 'enum', enum: Perm, default: Perm.DEFAULT })
    perms: Perm;

    @Column('json', { default: [] })
    sessions: string[];

    @Field({ nullable: true })
    @Column({ type: 'bigint', nullable: true })
    createdAt: number;

    @Field((returns) => BanEntity, { nullable: true })
    @OneToOne(() => BanEntity, (ban) => ban.user)
    ban: BanEntity;

    @Field((returns) => [UserReview])
    @OneToMany(() => UserReview, (review) => review.user)
    reviews: UserReview[];

    @Field((returns) => [Ads])
    @OneToMany(() => Ads, (ads) => ads.realtor)
    ads: Ads[];

    @Field()
    @Column({ nullable: true })
    twofa: string;

    @Field()
    @Column({ default: false })
    twofaConfirmed: boolean;

    @Field((returns) => [Ads])
    @ManyToMany(() => Ads, (ads) => ads.favoriteByUser)
    @JoinTable()
    favorites: Ads[];

    @Field()
    @Column({ type: 'double precision', default: 0 })
    rating: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    avatar: string;
}
