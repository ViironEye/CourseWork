import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    private format(ms) {
        function pad(s) {
            return (s < 10 ? '0' : '') + s;
        }

        let hours = Math.floor(ms / (60 * 60));
        let minutes = Math.floor((ms % (60 * 60)) / 60);
        let seconds = Math.floor(ms % 60);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    }
    @Get()
    main(@Req() req, @Res() res) {
        return res.json({
            ok: true,
            uptime: this.format(process.uptime()),
        });
    }
}
