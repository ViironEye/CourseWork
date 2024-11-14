import { Injectable } from '@nestjs/common';
import { verifyToken, generateSecret } from 'node-2fa';
import { User } from '../../entities/user/User.entity';

@Injectable()
export class TwoFaService {
    public async generateSecret(user: User) {
        const secret = generateSecret({
            name: 'Orion',
            account: user.username,
        });

        user.twofa = secret.secret;

        await user.save();

        return secret;
    }

    public async verifyKey(user: User, key: string): Promise<boolean> {
        const out = verifyToken(user.twofa, key);

        if (out) return out.delta <= 0;
        else return false;
    }
}
