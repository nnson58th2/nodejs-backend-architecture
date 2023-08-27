'use strict';

const { CREATED, OK } = require('../core/success.response');
const ProductService = require('../services/product.service');
const ProductServiceX = require('../services/product.service.xxx');

class ProductController {
    // QUERY

    /**
     * @desc Get all drafts for shop
     * @param {Number} limit
     * @param {Number} ship
     * @return { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        const payload = {
            productShop: req.user.userId,
            limit: req.query.limit,
            skip: req.query.skip,
        };

        const results = await ProductServiceX.getAllDraftsForShop(payload);
        new OK({
            message: 'Get all drafts for shop successfully',
            metadata: results,
        }).send(res);
    };

    /**
     * @desc Get all publish for shop
     * @param {Number} limit
     * @param {Number} ship
     * @return { JSON }
     */
    getAllPublishForShop = async (req, res, next) => {
        const payload = {
            productShop: req.user.userId,
            limit: req.query.limit,
            skip: req.query.skip,
        };

        const results = await ProductServiceX.getAllPublishForShop(payload);
        new OK({
            message: 'Get all publish for shop successfully',
            metadata: results,
        }).send(res);
    };

    getListSearchProducts = async (req, res, next) => {
        const keySearch = req.query.keySearch;
        const results = await ProductServiceX.getListSearchProducts({ keySearch });
        new OK({
            message: 'Get all products successfully',
            metadata: results,
        }).send(res);
    };

    getAllProducts = async (req, res, next) => {
        const paginationPayload = req.query;
        const results = await ProductServiceX.getAllProducts(paginationPayload);
        new OK({
            message: 'Get all products successfully',
            metadata: results,
        }).send(res);
    };

    getProductById = async (req, res, next) => {
        const productId = req.params.productId;
        const result = await ProductServiceX.getProductById(productId);
        new OK({
            message: 'Get product successfully',
            metadata: result,
        }).send(res);
    };
    // END QUERY

    // POST
    createProduct = async (req, res, next) => {
        const type = req.body.productType;
        const payload = {
            ...req.body,
            productShop: req.user.userId,
        };

        const result = await ProductServiceX.createProduct({ type, payload });
        new CREATED({
            message: 'Create a new Product successfully',
            metadata: result,
        }).send(res);
    };
    // END POST

    // PATCH
    publishProduct = async (req, res, next) => {
        const payload = {
            productShop: req.user.userId,
            productId: req.params.productId,
        };

        const result = await ProductServiceX.publishProductByShop(payload);
        new OK({
            message: 'Publish product for shop successfully',
            metadata: result,
        }).send(res);
    };

    unPublishProduct = async (req, res, next) => {
        const payload = {
            productShop: req.user.userId,
            productId: req.params.productId,
        };

        const result = await ProductServiceX.unPublishProductByShop(payload);
        new OK({
            message: 'Un-Publish product for shop successfully',
            metadata: result,
        }).send(res);
    };

    updateProduct = async (req, res, next) => {
        const type = req.body.productType;
        const productId = req.params.productId;
        const payload = {
            ...req.body,
            productShop: req.user.userId,
        };

        const result = await ProductServiceX.updateProduct({ type, productId, payload });
        new OK({
            message: 'Update product for shop successfully',
            metadata: result,
        }).send(res);
    };
    // END PATCH
}

module.exports = new ProductController();
