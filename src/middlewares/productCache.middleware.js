'use strict';

const { OK } = require('../core/success.response');
const { getCacheIO } = require('../models/repositories/redisCache.repo');

const { CACHE_PRODUCT } = require('../constants');

const readCache = async (req, res, next) => {
    const { sku_id } = req.query;

    const SKU_KEY_CACHE = `${CACHE_PRODUCT.SKU}::${sku_id}`;
    const skuCache = await getCacheIO(SKU_KEY_CACHE);
    if (!skuCache) return next();

    new OK({
        loadedFrom: 'cache',
        message: 'Get one sku',
        metadata: JSON.parse(skuCache),
    }).send(res);
};

module.exports = {
    readCache,
};
