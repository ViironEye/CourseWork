import { Field, ObjectType } from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Ads } from './Ads.entity';

@ObjectType('adsTags')
@Entity('adsTags')
export class AdsTagsEntity extends BaseEntity {
    @Field()
    @PrimaryColumn()
    uuid: string;

    @Field()
    @Column()
    name: string;

    @Field((returns) => [Ads])
    @ManyToMany(() => Ads, (ads) => ads.tags)
    ads: Ads[];
}
