'use strict';

const { BadRequestError, NotFoundRequestError } = require('../core/error.response');

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
        const query = { cartUserId: userId, cartState: 'ACTIVE' };
        const updateOrInsert = {
            $addToSet: {
                cartProduct: product,
            },
        };
        const option = { upset: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
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
}

module.exports = CartService;
