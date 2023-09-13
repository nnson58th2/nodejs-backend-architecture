'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        inventoryProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
        inventoryShopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        inventoryLocation: { type: String, default: 'unknown' },
        inventoryStock: { type: Number, require: true },
        inventoryReservations: { type: Array, default: [] },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
