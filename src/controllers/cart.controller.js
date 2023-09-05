'use strict';

const { OK } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {
    getListCart = async (req, res, next) => {
        const payload = {
            ...req.query,
        };

        const result = await CartService.getListUserCart(payload);

        new OK({
            message: 'List cart successfully!',
            metadata: result,
        }).send(res);
    };

    addToCart = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CartService.addToCart(payload);

        new OK({
            message: 'Create a new cart successfully!',
            metadata: result,
        }).send(res);
    };

    updateCart = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CartService.addToCartV2(payload);

        new OK({
            message: 'Update cart successfully!',
            metadata: result,
        }).send(res);
    };

    deleteCartItem = async (req, res, next) => {
        const payload = {
            ...req.body,
        };

        const result = await CartService.deleteUserCartItem(payload);

        new OK({
            message: 'Delete cart successfully!',
            metadata: result,
        }).send(res);
    };
}

module.exports = new CartController();
