'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

// Declare the Schema of the Mongo model
const spuSchema = new Schema(
    {
        product_id: { type: String, default: '' },
        product_name: { type: String, require: true },
        product_thumb: { type: String, require: true },
        product_description: { type: String, default: '' },
        product_slug: { type: String, require: true },
        product_price: { type: Number, require: true },
        product_quantity: { type: Number, require: true },
        product_category: { type: Array, default: [] },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        product_ratings_average: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be above 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Create index for search
spuSchema.index({ productName: 'text', productDescription: 'text' });

// Document middleware: runs before .save and .create()...
spuSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

module.exports = model(DOCUMENT_NAME, spuSchema);
