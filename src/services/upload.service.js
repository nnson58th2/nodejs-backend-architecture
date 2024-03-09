'use strict';

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');

const cloudinary = require('../configs/cloudinary.config');
const { S3, GetObjectCommand, PutObjectCommand } = require('../configs/s3.config');

const { randomImageName } = require('../utils');

// 1. Upload from ULR image
const uploadImageFromUrl = async () => {
    try {
        const urlImage =
            'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.6435-9/80642975_1229673913899705_5740920361784967168_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=be3454&_nc_ohc=ih6sgzK_4t8AX8C7iCZ&_nc_ht=scontent.fdad2-1.fna&oh=00_AfCMY3SFAeScRKcF77B1esHyEsYtSsd9yip8wNIDba6CVQ&oe=65688088';
        const folderName = 'product/230698';
        const newFileName = 'xoan-avatar';

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        });

        return result;
    } catch (error) {
        console.error('Upload image from URL error:: ', error.message);
    }
};

// 2. Upload image from local
const uploadImageFromLocal = async ({ path, folderName = 'product/230698' }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumbnail',
            folder: folderName,
        });

        return {
            imageUrl: result.secure_url,
            shopId: '230698',
            thumbnailUrl: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg',
            }),
        };
    } catch (error) {
        console.error('Upload image from URL error:: ', error.message);
    }
};

// Upload file use S3Client
const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg', // that is what your need!
        });

        const result = await S3.send(command);

        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });
        const url = await getSignedUrl(S3, signedUrl, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error('Upload image from file use S3Client error:: ', error.message);
    }
};

// END Upload file use S3Client

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalS3,
};
