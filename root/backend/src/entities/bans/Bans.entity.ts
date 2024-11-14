import { Field, ObjectType } from '@nestjs/graphql';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { User } from '../user/User.entity';

@ObjectType('bans')
@Entity('bans')
export class BanEntity extends BaseEntity {
    @Field()
    @PrimaryColumn()
    uuid: string;

    @Field()
    @Column({ type: 'bigint' })
    createdAt: number;

    @Field((returns) => User)
    @OneToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn()
    user: User;
}
