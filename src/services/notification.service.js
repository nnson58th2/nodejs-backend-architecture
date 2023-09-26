'use strict';

const notificationModel = require('../models/notification.model');

const pushNotiToSystem = async ({ type = 'SHOP-001', receivedId = 1, senderId = 1, options = {} }) => {
    let notiContent = '';

    if (type === 'SHOP-001') {
        notiContent = `@@@ vừa mới thêm một sản phẩm: @@@@`;
    }

    if (type === 'PROMOTION-001') {
        notiContent = `@@@ vừa mới thêm một voucher: @@@@@`;
    }

    const newNoti = await notificationModel.create({
        notiType: type,
        notiContent,
        notiSenderId: senderId,
        notiReceivedId: receivedId,
        notiOptions: options,
    });
    return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = 'ALL', idRead = 0 }) => {
    const match = { notiReceivedId: Number(userId) };

    if (type !== 'ALL') {
        match['notiType'] = type;
    }

    return await notificationModel.aggregate([
        {
            $match: match,
        },
        {
            $project: {
                notiType: 1,
                notiSenderId: 1,
                notiReceivedId: 1,
                notiContent: {
                    $concat: [
                        {
                            $substr: ['$notiOptions.shopName', 0, -1],
                        },
                        ' vừa mới thêm một sản phẩm: ', // language
                        {
                            $substr: ['$notiOptions.productName', 0, -1],
                        },
                    ],
                },
                notiOptions: 1,
                createdAt: 1,
            },
        },
    ]);
};

module.exports = {
    pushNotiToSystem,
    listNotiByUser,
};
