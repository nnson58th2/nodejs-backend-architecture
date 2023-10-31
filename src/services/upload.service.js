'use strict';

const cloudinary = require('../configs/cloudinary.config');

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

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
};
