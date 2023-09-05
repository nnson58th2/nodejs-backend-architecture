'use strict';

const { BadRequestError, NotFoundRequestError } = require('../core/error.response');
const { getUnSelectData } = require('../utils');

const { findProductById } = require('../models/repositories/product.repo');
const cartModel = require('../models/cart.model');

/**
 * 1 - Add product to cart [User]
 * 2 - Reduce product quantity by one [User]
 * 3 - Increase product quantity by on [User]
 * 4 - Get cart [User]
 * 5 - Delete cart [User]
 * 6 - Delete cart item [User]
 */

class CartService {
    /// START REPO CART
    static async createUserCart({ userId, product }) {
        const query = { cartUserId: userId, cartState: 'ACTIVE', cartCountProduct: 1 };
        const updateOrInsert = {
            $addToSet: {
                cartProducts: product,
            },
        };
        const option = { upsert: true, new: true };

        const cartCreateOrUpdate = await cartModel.findOneAndUpdate(query, updateOrInsert, option);
        return cartCreateOrUpdate;
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cartUserId: userId,
            cartState: 'ACTIVE',
            'cartProducts.productId': productId,
        };
        const updateSet = {
            $inc: {
                'cartProducts.$.quantity': quantity,
            },
        };
        const option = { upset: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateSet, option);
    }
    /// END REPO CART

    static async addToCart({ userId, product = {} }) {
        const { productId } = product;

        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundRequestError(`Product does't exists!`);

        Object.assign(product, {
            name: foundProduct.productName,
            price: foundProduct.productPrice,
        });

        const userCart = await cartModel.findOne({ cartUserId: userId });
        if (!userCart) {
            return await CartService.createUserCart({ userId, product });
        }

        if (!userCart.cartProducts.length) {
            userCart.cartProducts = [product];
            return await userCart.save();
        }

        return await CartService.updateUserCartQuantity({ cartUserId: userId });
    }

    /*
        shopOrderIds: [
            {
                shopId,
                itemProducts: [
                    {
                        price,
                        shopId,
                        oldQuantity,
                        quantity,
                        productId
                    }
                ],
                version
            }
        ]
     */
    static async addToCartV2({ userId, shopOrderIds }) {
        const shopOrderId = shopOrderIds[0];
        const { productId, quantity, oldQuantity } = shopOrderId?.itemProducts[0];

        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundRequestError(`Product does't exists!`);

        if (foundProduct.productShop.toString() !== shopOrderId?.shopId) {
            throw new NotFoundRequestError(`Product do not belong to the shop!`);
        }

        if (quantity === 0) {
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - oldQuantity,
            },
        });
    }

    static async getListUserCart({ userId }) {
        return await cartModel
            .findOne({
                cartUserId: userId,
            })
            .select(getUnSelectData(['__v']))
            .lean();
    }

    static async deleteUserCartItem({ userId, productId }) {
        const query = { cartUserId: userId, cartState: 'ACTIVE' };
        const updateSet = {
            $pull: {
                cartProducts: { productId },
            },
            $inc: {
                cartCountProduct: -1,
            },
        };

        return await cartModel.updateOne(query, updateSet);
    }
}

module.exports = CartService;
