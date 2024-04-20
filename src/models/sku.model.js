'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Sku';
const COLLECTION_NAME = 'Skus';

// Declare the Schema of the Mongo model
const skuSchema = new Schema(
    {
        sku_id: { type: String, required: true, unique: true },
        sku_tier_idx: { type: Array, default: [0] },
        sku_default: { type: Boolean, default: false },
        sku_slug: { type: String, require: true },
        sku_sort: { type: Number, default: 0 },
        sku_price: { type: String, require: true },
        sku_stock: { type: Number, default: 0 }, // array in off stock
        product_id: { type: String, require: true }, // reference to spu product

        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, skuSchema);
