'use strict';

const { removeUndefinedNullObject, updateNestedObjectParser } = require('../utils');

const { product, electronic, clothing, furniture } = require('../models/product.model');

const { BadRequestError } = require('../core/error.response');
const {
    findAllDraftsForShop,
    findAllPublishForShop,
    getAllProducts,
    getProductById,
    searchProductByUser,
    publishProductByShop,
    unPublishProductByShop,
    updateProductById,
} = require('../models/repositories/product.repo');
const { insertInventory } = require('../models/repositories/inventory.repo');

// Define Factory class to create product
class ProductFactory {
    static productRegistry = {}; // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct({ type, payload }) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).createProduct();
    }

    static async publishProductByShop({ productShop, productId }) {
        return await publishProductByShop({ productShop, productId });
    }

    static async unPublishProductByShop({ productShop, productId }) {
        return await unPublishProductByShop({ productShop, productId });
    }

    static async updateProduct({ type, productId, payload }) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).updateProduct(productId);
    }

    static async getAllDraftsForShop({ productShop, limit = 50, skip = 0 }) {
        const query = { productShop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async getAllPublishForShop({ productShop, limit = 50, skip = 0 }) {
        const query = { productShop, isDraft: false };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async getAllProducts({ filter = { isPublished: true }, pageSize = 50, page = 1, sort = 'ctime', select }) {
        if (!select) {
            select = ['productName', 'productPrice', 'productThumb'];
        }

        const paginationPayload = {
            filter,
            page,
            pageSize,
            sort,
            select,
        };
        return await getAllProducts(paginationPayload);
    }

    static async getProductById(productId) {
        const unSelect = ['__v'];
        return await getProductById(productId, unSelect);
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
        const productCreated = await product.create({ ...this, _id: productId });

        // Add product stock in inventory collection
        if (productCreated) {
            await insertInventory({
                productId: productCreated._id,
                shopId: this.productShop,
                stock: this.productQuantity,
            });
        }

        return productCreated;
    }

    // Update product
    async updateProductByShop(productId, payload) {
        return await updateProductById({ productId, payload, model: product });
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

    async updateProduct(productId) {
        const objParams = removeUndefinedNullObject(this);
        if (objParams.productAttributes) {
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(objParams.productAttributes),
                model: clothing,
            });
        }

        const updateProduct = await super.updateProductByShop(productId, updateNestedObjectParser(objParams));
        return updateProduct;
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newFurniture) throw new BadRequestError('Create a new Furniture error!');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Create a new Product error!');

        return newProduct;
    }
}

// Register product types
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
