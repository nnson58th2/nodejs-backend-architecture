'use strict';

const { model, Schema } = require('mongoose');

const PRODUCT_DOCUMENT_NAME = 'Product';
const PRODUCT_COLLECTION_NAME = 'Products';

const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const ELECTRONIC_COLLECTION_NAME = 'Electronics';

const CLOTHING_DOCUMENT_NAME = 'Clothing';
const CLOTHING_COLLECTION_NAME = 'Clothings';

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        productName: { type: String, require: true },
        productThumb: { type: String, require: true },
        productDescription: String,
        productPrice: { type: Number, require: true },
        productQuantity: { type: Number, require: true },
        productType: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        productAttributes: { type: Schema.Types.Mixed, required: true },
    },
    {
        timestamps: true,
        collection: PRODUCT_COLLECTION_NAME,
    }
);

// Define the product type electronics
const electronicSchema = new Schema(
    {
        manufacturer: { type: String, require: true },
        model: String,
        color: String,
    },
    {
        timestamps: true,
        collection: ELECTRONIC_COLLECTION_NAME,
    }
);

// Define the product type clothing
const clothingSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: CLOTHING_COLLECTION_NAME,
    }
);

module.exports = {
    product: model(PRODUCT_DOCUMENT_NAME, productSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
};
