'use strict';

const { BadRequestError } = require('../core/error.response');
const { randomProductId, getUnSelectData } = require('../utils');

const SKU_MODEL = require('../models/sku.model');

const createSku = async (payload) => {
    const { spu_id, sku_list = [] } = payload;

    const convertSkuList =
        sku_list?.map((sku) => {
            const productId = randomProductId();
            return { ...sku, product_id: spu_id, sku_id: `${spu_id}.${productId}` };
        }) || [];

    if (!convertSkuList.length) throw new BadRequestError('Missing sku list');

    const skus = await SKU_MODEL.create(convertSkuList);
    return skus;
};

const findOneSku = async ({ sku_id, product_id }) => {
    // Read cache
    const unSelect = ['createdAt', 'updatedAt', 'deletedAt', '__v'];
    const sku = await SKU_MODEL.findOne({ sku_id }).select(getUnSelectData(unSelect)).lean();
    if (!sku) throw new BadRequestError('SKU not found!');

    // Set cache

    return sku;
};

module.exports = {
    createSku,
    findOneSku,
};
