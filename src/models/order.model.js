'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
    {
        orderUserId: { type: Number, require: true },
        /*
            orderCheckout: {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
        */
        orderCheckout: { type: Object, default: {} },

        /*
            orderShipping: {
                street,
                city,
                state,
                country
            }
        */
        orderShipping: { type: Object, default: {} },
        orderPayment: { type: Object, default: {} },
        orderProducts: { type: Array, require: true },
        orderTrackingNumber: { type: String, default: '#00011092023' },
        orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
