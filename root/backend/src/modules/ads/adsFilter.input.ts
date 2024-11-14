import { Field, InputType } from '@nestjs/graphql';
import { PriceRangeInput } from './price_range.input';
import { FloorsRangeInput } from './floors_range.input';

@InputType()
export class AdsFilter {
    @Field({ nullable: true })
    ads_type: 'all' | 'sell' | 'rent';

    @Field({ nullable: true })
    order_by: 'asc' | 'desc' | 'new' | 'none';

    @Field(() => PriceRangeInput, { nullable: true })
    price_range: PriceRangeInput;

    @Field({ nullable: true })
    districts: string;

    @Field({ nullable: true })
    square: number;

    @Field({ nullable: true })
    plot_area: number;

    @Field({ nullable: true })
    balcony: boolean;

    @Field({ nullable: true })
    object_type: 'all' | 'flat' | 'house' | 'land' | 'commercial' | 'garage';

    @Field(() => FloorsRangeInput, { nullable: true })
    floors_range: FloorsRangeInput;
}
