'use strict';

const { CREATED } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    createProduct = async (req, res, next) => {
        const type = req.body.productType;
        const payload = req.body;

        const result = await ProductService.createProduct({ type, payload });
        new CREATED({
            message: 'Create a new Product successfully',
            metadata: result,
        }).send(res);
    };
}

module.exports = new ProductController();
