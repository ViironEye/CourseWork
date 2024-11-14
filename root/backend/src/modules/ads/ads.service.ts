import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ads } from '../../entities/ads/Ads.entity';
import { Repository } from 'typeorm';
import { AdsFilter } from './adsFilter.input';

@Injectable()
export class AdsService {
    constructor(@InjectRepository(Ads) private repo: Repository<Ads>) {}
    async getAll(data?: AdsFilter) {
        let ads = await this.repo.createQueryBuilder('ads').getMany();
        if (data) {
            if (data.ads_type) {
                switch (data.ads_type) {
                    case 'all':
                        break;
                    case 'rent':
                        ads = ads.filter(
                            (_ads) => _ads.ads_type === data.ads_type,
                        );
                        break;
                    case 'sell':
                        ads = ads.filter(
                            (_ads) => _ads.ads_type === data.ads_type,
                        );
                        break;
                }
            }
            if (data.order_by) {
                switch (data.order_by) {
                    case 'asc':
                        ads = ads.sort((a, b) => a.price - b.price);
                        break;
                    case 'desc':
                        ads = ads.sort((a, b) => b.price - a.price);
                        break;
                    case 'new':
                        ads = ads.sort((a, b) => b.createdAt - a.createdAt);
                        break;
                    case 'none':
                        break;
                }
            }
            if (data.price_range) {
                if (
                    data.price_range ||
                    data.price_range.min ||
                    data.price_range.max
                ) {
                    const minPrice = data.price_range.min;
                    const maxPrice = data.price_range.max;

                    ads = ads.filter((ad) => {
                        return (
                            (minPrice === null || ad.price >= minPrice) &&
                            (maxPrice === null || ad.price <= maxPrice)
                        );
                    });
                }
            }
            if (data.districts) {
                if (data.districts !== 'all') {
                    ads = ads.filter(
                        (_ads) => _ads.district === data.districts,
                    );
                }
            }
            if (data.floors_range && data.object_type === 'flat') {
                const minFloors = data.floors_range.min;
                const maxFloors = data.floors_range.max;

                ads = ads.filter((ad) => {
                    return (
                        (minFloors === null || ad.floors >= minFloors) &&
                        (maxFloors === null || ad.floors <= maxFloors)
                    );
                });
            }
            if (data.object_type) {
                switch (data.object_type) {
                    case 'all':
                        break;
                    case 'flat':
                        ads = ads.filter(
                            (_ads) => _ads.object_type === data.object_type,
                        );
                        break;
                    case 'house':
                        ads = ads.filter(
                            (_ads) => _ads.object_type === data.object_type,
                        );
                        break;
                    case 'land':
                        ads = ads.filter(
                            (_ads) => _ads.object_type === data.object_type,
                        );
                        break;
                    case 'commercial':
                        ads = ads.filter(
                            (_ads) => _ads.object_type === data.object_type,
                        );
                        break;
                    case 'garage':
                        ads = ads.filter(
                            (_ads) => _ads.object_type === data.object_type,
                        );
                        break;
                }
            }
            if (
                (data.object_type === 'house' || data.object_type === 'land') &&
                data.plot_area
            ) {
                ads = ads.filter((_ads) => _ads.plot_area === data.plot_area);
            }
            if (
                (data.object_type === 'house' || data.object_type === 'flat') &&
                data.balcony
            ) {
                ads = ads.filter((_ads) => _ads.balcony === data.balcony);
            }
            return ads;
        } else return ads;
    }
    async findById(id: string) {
        return await this.repo.findOneBy({
            id,
        });
    }

    async getById(id: string) {
        return await Ads.findOne({
            where: {
                id,
            },
            relations: ['realtor'],
        });
    }
}
