import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Ads } from '../../entities/ads/Ads.entity';
import { User as usr } from '../user/user.paramdecorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../entities/user/User.entity';
import { AdsService } from './ads.service';
import { Perms } from '../auth/perm.decorator';
import { Perm } from '../../enums/perm';
import { AdsInput } from './ads.input';
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';
import { AdsFilter } from './adsFilter.input';

const perPage = 15;
@Resolver((of) => Ads)
export class AdsResolver {
    constructor(private adsService: AdsService) {}
    @Query((returns) => [Ads], { nullable: true })
    async getAllAds(@Args('data', { nullable: true }) data: AdsFilter) {
        return await this.adsService.getAll(data);
    }

    @Query((returns) => Ads)
    async getById(@Args('id') id: string) {
        return await this.adsService.getById(id);
    }
    @Perms(Perm.REALTOR, Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Mutation((returns) => Ads, { nullable: true })
    async adsAdd(@Args('data') data: AdsInput, @usr() user: User) {
        if (!user) return null;

        const ads = Ads.create({
            name: data.name,
            description: data.description,
            sub_description: data.sub_description,
            ads_type: data.ads_type,
            location: data.location,
            location_name: data.location_name,
            floors: data.floors,
            at_floor: data.at_floor,
            square: data.square,
            room_numbers: data.room_numbers,
            district: data.district,
            object_type: data.object_type,
            balcony: data.balcony,
            plot_area: data.plot_area === null ? 0 : data.plot_area,
            price: data.price,
            realtor: user,
            createdAt: Date.now(),
        });
        await ads.save();

        return ads;
    }
    @Perms(Perm.REALTOR, Perm.ADMIN)
    @UseGuards(AuthGuard)
    @Mutation((returns) => Ads, { nullable: true })
    async adsEdit(
        @Args('id') id: string,
        @Args('data') data: AdsInput,
        @usr() user: User,
    ) {
        if (!user) return null;
        const ads = await Ads.findOneBy({
            id,
        });
        ads.name = data.name;
        ads.description = data.description;
        ads.sub_description = data.sub_description;
        ads.ads_type = data.ads_type;
        ads.location = data.location;
        ads.price = data.price;
        ads.floors = data.floors;
        ads.at_floor = data.at_floor;
        ads.square = data.square;
        ads.room_numbers = data.room_numbers;
        ads.district = data.district;
        ads.balcony = data.balcony;
        ads.plot_area = data.plot_area;
        ads.object_type = data.object_type;

        return await ads.save();
    }

    @UseGuards(AuthGuard)
    @Query((returns) => [Ads])
    async getUserFavorites(@usr() user: User) {
        return await Ads.find({
            where: {
                realtor: {
                    id: user.id,
                },
            },
        });
    }

    @Query((returns) => [GraphQLJSON])
    async getDistricts() {
        const ads = await this.adsService.getAll();
        const districts = ads.map((_ad) => _ad.district);

        return [
            ...new Set(districts.map((_dis) => _dis.replaceAll(',  ', ', '))),
        ];
        //return (districts.map((_dis) => _dis.includes(",  ") ? (_dis.split(",  ")) : (_dis.split(", "))) as (string[])[]).map((_dis) => ({city: _dis[0], district: _dis[1]}))
    }

    // voice:.idea/1695388155057.wav
}
