'use strict';

const { getSelectData, getUnSelectData } = require('../../utils');

const discountModel = require('../discount.model');

const findDiscount = async ({ filter }) => {
    return await discountModel.findOne(filter).lean();
};

const findAllDiscountCodeSelect = async ({ filter, limit = 50, page = 1, sort = 'ctime', select }) => {
    const skip = (page - 1) * pageSize;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await discountModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean().exec();
};

const findAllDiscountCodeUnSelect = async ({ filter, limit = 50, page = 1, sort = 'ctime', unSelect }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await discountModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getUnSelectData(unSelect)).lean().exec();
};

module.exports = {
    findDiscount,
    findAllDiscountCodeSelect,
    findAllDiscountCodeUnSelect,
};
