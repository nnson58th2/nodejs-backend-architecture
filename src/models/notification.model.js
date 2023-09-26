'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// Declare the Schema of the Mongo model
const notificationSchema = new Schema(
    {
        notiType: { type: String, enum: ['ALL', 'ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
        notiSenderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
        notiReceivedId: { type: Number, required: true },
        notiContent: { type: String, required: true },
        notiOptions: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
