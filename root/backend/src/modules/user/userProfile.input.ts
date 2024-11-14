import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class UserProfileInput {
    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    link_vk: string;

    @Field({ nullable: true })
    first_name: string;

    @Field({ nullable: true })
    last_name: string;

    @Field({ nullable: true })
    patronymic: string;

    @Field({ nullable: true })
    code: string;
}
