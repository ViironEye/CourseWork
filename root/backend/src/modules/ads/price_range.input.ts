import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class PriceRangeInput {
    @Field(() => Float, { nullable: true })
    min: number;

    @Field(() => Float, { nullable: true })
    max: number;
}
