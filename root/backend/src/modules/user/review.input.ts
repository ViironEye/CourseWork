import { InputType, Field } from '@nestjs/graphql';

@InputType()
export default class ReviewInput {
    @Field()
    text: string;

    @Field({ nullable: true })
    rating: number;
}
