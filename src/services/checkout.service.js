'use strict';

const { BadRequestError } = require('../core/error.response');

const orderModel = require('../models/order.model');

const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');

const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLook } = require('./redis.service');

class CheckoutService {
    /*
        {
            cartId,
            userId,
            shopOrderIds: [
                {
                    shopId,
                    shopDiscounts: [],
                    itemProducts: [
                        {
                            productId,
                            price,
                            quantity
                        }
                    ]
                },
                {
                    shopId,
                    shopDiscounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    itemProducts: [
                        {
                            productId,
                            price,
                            quantity
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shopOrderIds }) {
        // Check cartId tồn tại không?
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError(`Cart doesn't exists!`);

        const checkoutOrder = {
            totalPrice: 0, // Tổng tiền hàng
            feeShip: 0, // Phí vận chuyển
            totalDiscount: 0, // Tổng tiền discount giảm giá
            totalCheckout: 0, // Tổng thanh toán
        };

        const shopOrderIdsNew = [];

        for (let i = 0; i < shopOrderIds.length; i++) {
            const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderIds[i];

            // Check product available
            const checkProductServer = await checkProductByServer(itemProducts);
            if (!checkProductServer[0]) throw new BadRequestError(`Order wrong!`);

            // Total order
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            // Total before process
            checkoutOrder.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shopDiscounts,
                priceRaw: checkoutPrice, // Tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice, // Tiền sau khi đã giảm giá
                itemProducts: checkProductServer,
            };

            // Nếu shopDiscounts tồn tại > 0, check xem có hợp lệ hay không?
            if (shopDiscounts.length) {
                // Giả xử chỉ có một discount
                // Get discount amount
                const { totalPrice = 0, discountAmount = 0 } = await getDiscountAmount({
                    codeId: shopDiscounts[0].codeId,
                    shopId,
                    userId,
                    products: checkProductServer,
                });

                // Tổng discount giảm giá
                checkoutOrder.totalDiscount += discountAmount;
                if (discountAmount > 0) {
                    itemCheckout.priceApplyDiscount = totalPrice;
                }
            }

            // Tổng thanh toán cuối cùng
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
            shopOrderIdsNew.push(itemCheckout);
        }

        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder,
        };
    }

    static async pay({ shopOrderIds, cartId, userId, userAddress = {}, userPayment = {} }) {
        const { shopOrderIdsNew, checkoutOrder } = await this.checkoutReview({
            cartId,
            userId,
            shopOrderIds,
        });

        // Check lại một lần nữa xem vượt tồn kho hay không?
        const products = shopOrderIdsNew.flatMap((order) => order.itemProducts);
        console.log(`[1]::`, products);
        const acquireProduct = [];

        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(!!keyLock);

            if (keyLock) {
                await releaseLook(keyLock);
            }
        }

        // Check nếu có 1 sản phẩm hết hàng trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(`Some products have been updated. Please return to cart!`);
        }

        const newOrder = await orderModel.create({
            orderUserId: userId,
            orderCheckout: checkoutOrder,
            orderShipping: userAddress,
            orderPayment: userPayment,
            orderProducts: shopOrderIdsNew,
        });

        // Trường hợp nếu insert thành công -> remove product có trong giỏ hàng
        if (newOrder) {
        }

        return newOrder;
    }

    // Query all orders [User]
    static async getAllOrdersByUser() {}

    // Query order using ID [User]
    static async getOrderByUser() {}

    // Cancel order [User]
    static async cancelOrderByUser() {}

    // Update order status [Shop | Admin]
    static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
