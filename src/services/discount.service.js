'use strict';

const { BadRequestError, NotFoundRequestError } = require('../core/error.response');
const { convertToObjectId } = require('../utils');

const discountModel = require('../models/discount.model');
const { getAllProducts } = require('../models/repositories/product.repo');
const { findAllDiscountCodeUnSelect, findDiscount } = require('../models/repositories/discount.repo');

/**
 * 1 - Generator discount code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [Admin | Shop]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            startAt,
            endAt,
            isActive,
            shopId,
            minOrderValue,
            productIds,
            appliesTo,
            name,
            description,
            type,
            value,
            maxValue,
            maxUses,
            usesCount,
            maxUsesPerUser,
        } = payload;

        const startAtCompare = new Date() > new Date(startAt);
        const endAtCompare = new Date() > new Date(endAt);
        const startAtAndEndAtCompare = new Date(startAt) >= new Date(endAt);

        if (startAtCompare || endAtCompare) throw new BadRequestError('Discount code has expired!');

        if (startAtAndEndAtCompare) throw new BadRequestError('Start date must be before end date!');

        const foundDiscount = await findDiscount({
            filter: {
                discountCode: code,
                discountShopId: convertToObjectId(shopId),
            },
        });
        if (foundDiscount?.discountIsActive) throw new BadRequestError(`Discount doesn't exists!`);

        const newDiscount = await discountModel.create({
            discountShopId: shopId,
            discountName: name,
            discountDescription: description,
            discountType: type,
            discountValue: value,
            discountCode: code,
            discountStartAt: new Date(startAt),
            discountEndAt: new Date(endAt),
            discountMaxUses: maxUses,
            discountUsesCount: usesCount,
            discountMaxUsesPerUser: maxUsesPerUser,
            discountMinOrderValue: minOrderValue || 0,
            discountMaxValue: maxValue,
            discountIsActive: isActive,
            discountAppliesTo: appliesTo,
            discountProductIds: appliesTo === 'ALL' ? [] : productIds,
        });
        return newDiscount;
    }

    static async updateDiscountCode() {}

    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        const foundDiscount = await findDiscount({
            filter: {
                discountCode: code,
                discountShopId: convertToObjectId(shopId),
            },
        });
        if (!foundDiscount?.discountIsActive) throw new BadRequestError(`Discount doesn't exists!`);

        const { discountAppliesTo, discountProductIds } = foundDiscount;
        let products = [];

        if (discountAppliesTo === 'ALL') {
            products = getAllProducts({
                filter: {
                    productShop: convertToObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['productName'],
            });
        }

        if (discountAppliesTo === 'SPECIFIC') {
            products = getAllProducts({
                filter: {
                    _id: { $in: discountProductIds },
                    productShop: convertToObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['productName'],
            });
        }
        return products;
    }

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnSelect({
            filter: {
                discountShopId: convertToObjectId(shopId),
                discountIsActive: true,
            },
            limit: +limit,
            page: +page,
            unSelect: ['__v', 'discountShopId'],
        });
        return discounts;
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await findDiscount({
            filter: {
                discountCode: codeId,
                discountShopId: convertToObjectId(shopId),
            },
        });
        if (!foundDiscount) throw new NotFoundRequestError(`Discount doesn't exists!`);

        const {
            discountIsActive,
            discountMaxUses,
            discountStartAt,
            discountEndAt,
            discountMinOrderValue,
            discountMaxUsesPerUser,
            discountUsersUsed,
            discountType,
            discountValue,
        } = foundDiscount;

        if (!discountIsActive) throw new BadRequestError('Discount code has expired!');

        if (!discountMaxUses) throw new BadRequestError('Discount are out!');

        const startAtCompare = new Date() > new Date(discountStartAt);
        const endAtCompare = new Date() > new Date(discountEndAt);
        if (startAtCompare || endAtCompare) throw new BadRequestError('Discount code has expired!');

        let totalOrder = 0;
        if (discountMinOrderValue > 0) {
            // Get total order
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            if (totalOrder < discountMinOrderValue) throw new BadRequestError(`Discount requires a minium order value of ${discountMinOrderValue}!`);
        }

        if (discountMaxUsesPerUser > 0) {
            const userUsedDiscount = discountUsersUsed.find((user) => user.userId === userId);
            if (userUsedDiscount) {
                //... Xét trường hợp mỗi user chỉ sử dụng 1 lần
            }
        }

        const discountAmount = discountType === 'FIXED_AMOUNT' ? discountValue : totalOrder * (discountValue / 100);
        const totalPrice = totalOrder - discountAmount;

        return {
            discountAmount,
            totalPrice,
            totalOrder,
        };
    }

    // Xét thêm trường hợp discount đã được xử dụng hay chưa mà xem xét xoá
    static async deleteDiscountCode({ code, shopId }) {
        const deleted = await discountModel.findOneAndDelete({
            discountCode: code,
            discountShopId: convertToObjectId(shopId),
        });
        return deleted;
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await findDiscount({
            filter: {
                discountCode: codeId,
                discountShopId: convertToObjectId(shopId),
            },
        });
        if (!foundDiscount) throw new NotFoundRequestError(`Discount doesn't exists!`);

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discountUsersUsed: userId,
            },
            $inc: {
                discountMaxUses: 1,
                discountUsesCount: -1,
            },
        });

        return result;
    }
}

module.exports = DiscountService;
