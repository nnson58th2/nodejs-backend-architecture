'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const PRODUCT_DOCUMENT_NAME = 'Product';
const PRODUCT_COLLECTION_NAME = 'Products';

const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const ELECTRONIC_COLLECTION_NAME = 'Electronics';

const CLOTHING_DOCUMENT_NAME = 'Clothing';
const CLOTHING_COLLECTION_NAME = 'Clothings';

const FURNITURE_DOCUMENT_NAME = 'Furniture';
const FURNITURE_COLLECTION_NAME = 'Furniture';

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        productName: { type: String, require: true },
        productThumb: { type: String, require: true },
        productDescription: String,
        productSlug: String,
        productPrice: { type: Number, require: true },
        productQuantity: { type: Number, require: true },
        productType: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        productAttributes: { type: Schema.Types.Mixed, required: true },
        productRatingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be above 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        productVariations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
    },
    {
        timestamps: true,
        collection: PRODUCT_COLLECTION_NAME,
    }
);

// Create index for search
productSchema.index({ productName: 'text', productDescription: 'text' });

// Document middleware: runs before .save and .create()...
productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, { lower: true });
    next();
});

// Define the product type electronics
const electronicSchema = new Schema(
    {
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: CLOTHING_COLLECTION_NAME,
    }
);

// Define the product type clothing
const furnitureSchema = new Schema(
    {
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: FURNITURE_COLLECTION_NAME,
    }
);

module.exports = {
    product: model(PRODUCT_DOCUMENT_NAME, productSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
    furniture: model(FURNITURE_DOCUMENT_NAME, furnitureSchema),
};
