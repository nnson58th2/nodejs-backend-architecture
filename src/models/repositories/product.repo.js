'use strict';

const { Types } = require('mongoose');

const { product } = require('../product.model');

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).populate('productShop', 'name email -_id').sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec();
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
        .find(
            {
                isDraft: false,
                isPublished: true,
                $text: { $search: regexSearch },
            },
            { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    return results;
};

const publishProductByShop = async ({ productShop, productId }) => {
    const foundShop = await product.findOne({
        _id: new Types.ObjectId(productId),
        productShop: new Types.ObjectId(productShop),
    });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
};

const unPublishProductByShop = async ({ productShop, productId }) => {
    const foundShop = await product.findOne({
        _id: new Types.ObjectId(productId),
        productShop: new Types.ObjectId(productShop),
    });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
};

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    searchProductByUser,
    publishProductByShop,
    unPublishProductByShop,
};
