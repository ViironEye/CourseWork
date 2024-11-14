import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/User.entity';
import { AdsTagsEntity } from './AdsTags.entity';

@Entity('ads')
@ObjectType('ads')
export class Ads extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    sub_description: string;

    @Field()
    @Column()
    ads_type: 'all' | 'sell' | 'rent';

    @Field()
    @Column()
    location_name: string;

    @Field(() => [String])
    @Column('text', { array: true })
    location: string[];

    @Field()
    @Column({ default: 1 })
    floors: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    at_floor: number;

    @Field()
    @Column()
    square: number;

    @Field()
    @Column({default: 0 })
    plot_area: number;

    @Field()
    @Column({ nullable: true })
    room_numbers: number;

    @Field()
    @Column()
    district: string;

    @Field()
    @Column({ default: false })
    balcony: boolean;

    @Field()
    @Column({ default: 0, type: 'bigint' })
    price: number;

    @Field()
    @Column()
    object_type: string;

    @Field()
    @Column({ type: 'bigint' })
    createdAt: number;

    @Field((returns) => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.id)
    realtor: User;

    @Field((returns) => [AdsTagsEntity])
    @ManyToMany(() => AdsTagsEntity, (tag) => tag.ads, { cascade: true })
    @JoinTable()
    tags: AdsTagsEntity[];

    @Field((returns) => User)
    @ManyToOne(() => User, (user) => user.favorites, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    favoriteByUser: User;

    @Column({ default: 0 })
    imageUpload: number;

    @Field(() => [String])
    @Column('json', { default: [] })
    images: string[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    thumbnail: string;
}
