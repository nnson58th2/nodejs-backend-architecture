'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Template';
const COLLECTION_NAME = 'Templates';

// Declare the Schema of the Mongo model
const templateSchema = new Schema(
    {
        temp_id: { type: Number, required: true },
        temp_name: { type: String, required: true },
        temp_status: { type: String, default: 'active', enum: ['active', 'inactive'] },
        temp_html: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, templateSchema);
