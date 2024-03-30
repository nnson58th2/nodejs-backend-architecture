'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'OtpLog';
const COLLECTION_NAME = 'OtpLogs';

// Declare the Schema of the Mongo model
const otpLogSchema = new Schema(
    {
        otp_token: { type: String, required: true },
        otp_email: { type: String, required: true },
        otp_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
        expire_at: {
            type: Date,
            default: Date.now,
            expires: 60, // Documents will expire after 60 seconds (1 minute)
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, otpLogSchema);
