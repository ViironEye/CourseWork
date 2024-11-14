import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { md5 } from '../../utils/crypto.util';
import { User } from '../../entities/user/User.entity';
import sharp from 'sharp';
import { Ads } from '../../entities/ads/Ads.entity';

@Injectable()
export class CdnService {
    private bucketParams = {
        Bucket: process.env.CDN_BUCKET,
    };
    s3 = new AWS.S3({
        accessKeyId: process.env.CDN_ACCESS_KEY,
        secretAccessKey: process.env.CDN_SECRET_ACCESS_KEY,
        endpoint: 'https://s3.timeweb.com',
        s3ForcePathStyle: true,
        region: 'ru-1',
        apiVersion: 'latest',
    });

    async getAllBuckets() {
        const res = this.s3.listBuckets();
        return await res.promise();
    }
    async getAllFiles() {
        const res = this.s3.listObjects(this.bucketParams);
        return await res.promise();
    }

    async uploadAvatar(res, req: any, file: any) {
        try {
            if (file) {
                try {
                    if (file.buffer) {
                        const fileHash = md5.hashFile(file.buffer);
                        const user = req.user as User;

                        if (user.avatar != fileHash) {
                            sharp(file.buffer)
                                .webp({
                                    effort: 0,
                                })
                                .toBuffer({
                                    resolveWithObject: true,
                                })
                                .then(async (webpData) => {
                                    user.avatar = fileHash;
                                    await user.save();
                                    const params = {
                                        Bucket: this.bucketParams.Bucket,
                                        Key: 'images/' + user.avatar + '.webp',
                                        Body: webpData.data,
                                    };
                                    await this.s3
                                        .upload(params)
                                        .promise()
                                        .then((data) => {
                                            return res.send({
                                                ok: true,
                                                hash: user.avatar,
                                            });
                                        })
                                        .catch((err) => {
                                            if (err) {
                                                return res.send({
                                                    ok: false,
                                                    message: 'UPLOAD_ERROR',
                                                });
                                            }
                                        });
                                })
                                .catch((err) => {
                                    return res.send({
                                        ok: false,
                                    });
                                });
                        } else {
                            return res.send({
                                ok: true,
                                hash: user.avatar,
                            });
                        }
                    } else {
                        return res.send({
                            ok: false,
                        });
                    }
                } catch (e) {
                    console.log(e);
                    return res.send({
                        ok: false,
                    });
                }
            } else {
                return res.send({
                    ok: false,
                });
            }
        } catch (e) {
            console.log('Error', e);
        }
    }
    async uploadAdsImage(res, file: any, id: string) {
        try {
            const ads = await Ads.findOne({
                where: {
                    id,
                },
            });
            if (ads.imageUpload > 10)
                return res.send({
                    ok: false,
                    message: 'UPLOAD_LIMIT',
                });
            if (file) {
                try {
                    if (file.buffer) {
                        const fileHash = md5.hashFile(file.buffer);

                        if (!ads.images.some((hash) => hash === fileHash)) {
                            sharp(file.buffer)
                                .webp({
                                    effort: 0,
                                })
                                .toBuffer({
                                    resolveWithObject: true,
                                })
                                .then(async (webpData) => {
                                    if (
                                        !ads.images.some(
                                            (hash) => hash === fileHash,
                                        )
                                    ) {
                                        ads.images.push(fileHash);
                                        ads.imageUpload++;
                                        await ads.save();
                                        const params = {
                                            Bucket: this.bucketParams.Bucket,
                                            Key: 'images/' + fileHash + '.webp',
                                            Body: webpData.data,
                                        };
                                        await this.s3
                                            .upload(params)
                                            .promise()
                                            .then((data) => {
                                                return res.send({
                                                    ok: true,
                                                    hash: fileHash,
                                                });
                                            })
                                            .catch((err) => {
                                                if (err) {
                                                    return res.send({
                                                        ok: false,
                                                        message: 'UPLOAD_ERROR',
                                                    });
                                                }
                                            });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.send({
                                        ok: false,
                                        message: 'UPLOAD_ERROR',
                                    });
                                });
                        } else {
                            return res.send({
                                ok: true,
                                hash: fileHash,
                            });
                        }
                    } else {
                        return res.send({
                            ok: false,
                            message: 'UPLOAD_ERROR',
                        });
                    }
                } catch (e) {
                    console.log(e);
                    return res.send({
                        ok: false,
                        message: 'UPLOAD_ERROR',
                    });
                }
            } else {
                return res.send({
                    ok: false,
                    message: 'UPLOAD_ERROR',
                });
            }
        } catch (e) {
            console.log('Error', e);
            return res.send({
                ok: false,
                message: 'UPLOAD_ERROR',
            });
        }
    }

    async uploadAdsThumbnail(res, req: any, file: any, id: string) {
        try {
            if (file) {
                try {
                    const ads = await Ads.findOne({
                        where: {
                            id,
                        },
                    });
                    if (file.buffer) {
                        const fileHash = md5.hashFile(file.buffer);

                        if (ads.thumbnail != fileHash) {
                            sharp(file.buffer)
                                .webp({
                                    effort: 0,
                                })
                                .toBuffer({
                                    resolveWithObject: true,
                                })
                                .then(async (webpData) => {
                                    ads.thumbnail = fileHash;
                                    await ads.save();
                                    const params = {
                                        Bucket: this.bucketParams.Bucket,
                                        Key:
                                            'images/' + ads.thumbnail + '.webp',
                                        Body: webpData.data,
                                    };
                                    await this.s3
                                        .upload(params)
                                        .promise()
                                        .then((data) => {
                                            return res.send({
                                                ok: true,
                                                hash: ads.thumbnail,
                                            });
                                        })
                                        .catch((err) => {
                                            if (err) {
                                                return res.send({
                                                    ok: false,
                                                    message: 'UPLOAD_ERROR',
                                                });
                                            }
                                        });
                                })
                                .catch((err) => {
                                    return res.send({
                                        ok: false,
                                    });
                                });
                        } else {
                            return res.send({
                                ok: true,
                                hash: ads.thumbnail,
                            });
                        }
                    } else {
                        return res.send({
                            ok: false,
                        });
                    }
                } catch (e) {
                    console.log(e);
                    return res.send({
                        ok: false,
                    });
                }
            } else {
                return res.send({
                    ok: false,
                });
            }
        } catch (e) {
            console.log('Error', e);
            return res.send({
                ok: false,
            });
        }
    }

    async deleteAvatar(res, req) {
        const user = req.user as User;
        const params = {
            Bucket: this.bucketParams.Bucket,
            Key: 'images/' + user.avatar + '.webp',
        };
        this.s3.deleteObject(params, async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка удаления файла из S3.');
            }
            user.avatar = null;
            await user.save();
            res.send({
                ok: true,
            });
        });
    }
    async deleteAdsImage(res, id: string) {
        const ads = await Ads.findOne({
            where: {
                id,
            },
        });
        const deleteImage = ads.images.find((_ads) => _ads === id);
        const params = {
            Bucket: this.bucketParams.Bucket,
            Key: 'images/' + deleteImage + '.webp',
        };
        this.s3.deleteObject(params, async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка удаления файла из S3.');
            }
            ads.images = ads.images.filter((_ads) => _ads === deleteImage);
            await ads.save();
            res.send({
                ok: true,
            });
        });
    }
}
