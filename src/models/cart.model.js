'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
    {
        cartState: {
            type: String,
            require: true,
            enum: ['ACTIVE', 'COMPLETED', 'FAILED', 'PENDING'],
            default: 'ACTIVE',
        },
        cartProducts: { type: Array, require: true, default: [] },
        cartCountProduct: { type: Number, default: 0 },
        cartUserId: { type: Number, require: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, cartSchema);
