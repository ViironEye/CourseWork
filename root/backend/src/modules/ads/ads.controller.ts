import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Perm } from '../../enums/perm';
import { Perms } from '../auth/perm.decorator';
import { User } from '../../entities/user/User.entity';
import { UserService } from '../user/user.service';
import { User as UserParam } from '../user/user.paramdecorator';
import { Ads } from '../../entities/ads/Ads.entity';
import HttpException from '../../exteptions/HttpException';

@Controller('ads')
export class AdsController {
    constructor(
        private adsService: AdsService,
        private userService: UserService,
    ) {}
    @UseGuards(AuthGuard)
    @Post('/:id/realtor')
    async addRealtor(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
    ) {
        const ads = await this.adsService.getById(id);
        if (!ads) return res.send(new HttpException(401, 'ADS_NOT_FOUND'));
        const user = await this.userService.findUserByEmail(body.email);
        if (!user) return res.send(new HttpException(401, 'USER_NOT_FOUND'));
        if (ads.realtor == user)
            return res.send({
                ok: false,
            });
        ads.realtor = user;
        await ads.save();
        return res.send({
            ok: true,
        });
    }
    @UseGuards(AuthGuard)
    @Delete('/:id/realtor')
    async deleteRealtor(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
    ) {
        const ads = await this.adsService.getById(id);
        if (!ads) return res.send(new HttpException(401, 'Ads not found'));
        ads.realtor = null;
        await ads.save();
        return res.send({
            ok: true,
        });
    }

    @UseGuards(AuthGuard)
    @Put('/:id/favorites')
    async saveOrDeleteFavorites(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
        @UserParam() _user: User,
    ) {
        const ads = await this.adsService.getById(id);
        if (!ads)
            return res.status(400).send({
                ok: false,
                error: 'Ads not found',
            });
        const user = await User.findOne({
            where: {
                id: _user.id,
            },
            relations: ['favorites'],
        });
        if (!user.favorites.find((_com) => _com.id === ads.id)) {
            user.favorites.push(ads);
            res.send({
                ok: true,
                added: true,
            });
        } else {
            user.favorites = user.favorites.filter((ad) => ad.id !== ads.id);
            res.send({
                ok: true,
                delete: true,
            });
        }
        await user.save();
    }

    @UseGuards(AuthGuard)
    @Perms(Perm.ADMIN)
    @Delete('/:id')
    async adsDelete(
        @Param('id') id: string,
        @Req() req,
        @Res() res,
        @Body() body,
    ) {
        if (!id) return null;
        try {
            const ads = await Ads.findOneBy({
                id,
            });
            if (!ads) return null;
            await ads.remove();
            return res.send({
                ok: true,
            });
        } catch (e) {
            return res.send({
                ok: false,
            });
        }
    }
}
