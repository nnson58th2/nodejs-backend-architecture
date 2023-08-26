'use strict';

const { product, electronic, clothing } = require('../models/product.model');

const { BadRequestError } = require('../core/error.response');

// Define Factory class to create product
class ProductFactory {
    static async createProduct({ type, payload }) {
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct();
            case 'Clothing':
                return new Clothing(payload).createProduct();

            default:
                throw new BadRequestError(`Invalid product type ${type}`);
        }
    }
}

// Define base product class
class Product {
    constructor({ productName, productThumb, productDescription, productPrice, productQuantity, productType, productShop, productAttributes }) {
        this.productName = productName;
        this.productThumb = productThumb;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productShop = productShop;
        this.productAttributes = productAttributes;
    }

    // Create a new product
    async createProduct(productId) {
        return await product.create({ ...this, _id: productId });
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newElectronic) throw new BadRequestError('Create a new Electronic error!');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Create a new Product error!');

        return newProduct;
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newClothing) throw new BadRequestError('Create a new Clothing error!');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create a new Product error!');

        return newProduct;
    }
}

module.exports = ProductFactory;
