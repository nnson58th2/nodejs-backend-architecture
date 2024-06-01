'use strict';

const { BadRequestError } = require('../core/error.response');
const { randomProductId, getUnSelectData } = require('../utils');

const SKU_MODEL = require('../models/sku.model');
const { setCacheIOExpiration } = require('../models/repositories/redisCache.repo');

const { CACHE_PRODUCT } = require('../constants');

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
    // 1. Check params: @TODO: Check params from middleware
    if (sku_id < 0 || product_id < 0) return null;

    // 2. Read form dbs
    const unSelect = ['createdAt', 'updatedAt', 'deletedAt', '__v'];
    const sku = await SKU_MODEL.findOne({ sku_id }).select(getUnSelectData(unSelect)).lean();

    // 3. Set cache
    const SKU_KEY_CACHE = `${CACHE_PRODUCT.SKU}::${sku_id}`;
    const skuCacheValue = sku || null;
    await setCacheIOExpiration({
        key: SKU_KEY_CACHE,
        value: JSON.stringify(skuCacheValue),
        expirationInSeconds: 30,
    });

    if (!sku) throw new BadRequestError('SKU not found!');
    return sku;
};

module.exports = {
    createSku,
    findOneSku,
};
