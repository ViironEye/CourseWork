import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Column } from 'typeorm';

@InputType()
export class AdsInput {
    @Field({ nullable: true })
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    sub_description: string;

    @Field()
    price: number;

    @Field()
    ads_type: 'all' | 'sell' | 'rent';

    @Field()
    location_name: string;

    @Field(() => [String])
    location: string[];

    @Field()
    floors: number;

    @Field({ nullable: true })
    at_floor: number;

    @Field()
    square: number;

    @Field()
    room_numbers: number;

    @Field()
    district: string;

    @Field({ nullable: true })
    balcony: boolean;

    @Field({ nullable: true })
    plot_area: number;

    @Field()
    object_type: string;
}
