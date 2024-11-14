import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CdnService } from './cdn.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../guards/auth.guard';
import { UserGuard } from '../../guards/user.guard';

@Controller('cdn')
export class CdnController {
    constructor(private cdnService: CdnService) {}

    @Get('/')
    async getCdn(@Req() req, @Res() res, @Body() body) {
        return res.send(await this.cdnService.getAllBuckets());
    }

    @Get('/getAll')
    async getAll(@Req() req, @Res() res, @Body() body) {
        return res.send(await this.cdnService.getAllFiles());
    }

    @UseGuards(UserGuard)
    @Post('/upload/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @Req() req,
        @Res() res,
        @Body() body,
        @UploadedFile() file,
    ) {
        return await this.cdnService.uploadAvatar(res, req, file);
    }
    @UseGuards(UserGuard)
    @Delete('/upload/avatar')
    async deleteAvatar(@Req() req, @Res() res) {
        return await this.cdnService.deleteAvatar(res, req);
    }

    @UseGuards(UserGuard)
    @Post('/upload/ads/:id/image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAdsImage(
        @Req() req,
        @Res() res,
        @Body() body,
        @UploadedFile() file,
        @Param('id') id: string,
    ) {
        return await this.cdnService.uploadAdsImage(res, file, id);
    }
    @UseGuards(UserGuard)
    @Post('/upload/ads/:id/thumbnail')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAds(
        @Req() req,
        @Res() res,
        @Body() body,
        @UploadedFile() file,
        @Param('id') id: string,
    ) {
        return await this.cdnService.uploadAdsThumbnail(res, req, file, id);
    }

    @UseGuards(UserGuard)
    @Delete('/upload/ads/:id/image')
    async deleteAdsImage(@Req() req, @Res() res, @Param('id') id: string) {
        return await this.cdnService.deleteAdsImage(res, id);
    }
}
