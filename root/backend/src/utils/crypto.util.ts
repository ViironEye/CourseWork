const CryptoJS = require('crypto-js');
import enc from 'crypto-js/enc-utf8';
import * as dotenv from 'dotenv';

dotenv.config();

export class aes {
    static encrypt(data: any): string {
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            process.env.SECRET_TOKEN,
        ).toString();
    }

    static decrypt(data: any): string {
        return JSON.parse(
            CryptoJS.AES.decrypt(data, process.env.SECRET_TOKEN).toString(
                CryptoJS.enc.Utf8,
            ),
        );
    }
}
export class md5 {
    static hash(key: any) {
        return CryptoJS.HmacMD5(key, process.env.SECRET_TOKEN).toString();
    }

    static hashFile(key: Buffer) {
        return CryptoJS.MD5(key.toString()).toString();
    }

    static verify(password: string, hash: string) {
        const passwordHash = CryptoJS.HmacMD5(
            password,
            process.env.SECRET_TOKEN,
        ).toString();

        return hash === passwordHash;
    }
}
