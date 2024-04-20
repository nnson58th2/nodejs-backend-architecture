'use strict';

const { NotFoundRequestError, BadRequestError } = require('../core/error.response');
const { randomProductId } = require('../utils');

const SPU_MODEL = require('../models/spu.model');

const { getShopById } = require('../models/repositories/shop.repo');
const skuService = require('./sku.service');

const createSpu = async (payload) => {
    const {
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
        sku_list = [],
    } = payload;

    // 1. Check if shop exists
    const foundShop = await getShopById({
        shop_id: product_shop,
        select: ['email', 'name', 'status', 'roles'],
    });
    if (!foundShop) throw new NotFoundRequestError('Shop not found!');

    // 2. Create a new SPU
    const spu = await SPU_MODEL.create({
        product_id: randomProductId(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
    });
    if (!spu) throw new BadRequestError('Creation spu failed!');

    // 3. create skus
    if (sku_list.length > 0) {
        skuService.createSku({ spu_id: spu.product_id, sku_list });
    }

    // 4. Sync data via elasticsearch (search.service)

    // 5. Response result object
    return spu;
};

module.exports = {
    createSpu,
};
