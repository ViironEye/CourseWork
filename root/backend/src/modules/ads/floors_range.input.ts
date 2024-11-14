import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class FloorsRangeInput {
    @Field(() => Float, { nullable: true })
    min: number;

    @Field(() => Float, { nullable: true })
    max: number;
}
