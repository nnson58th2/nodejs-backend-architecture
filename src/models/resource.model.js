'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';

// Declare the Schema of the Mongo model
const resourceSchema = new Schema(
    {
        src_id: { type: Number, required: true },
        src_name: { type: String, required: true },
        src_slug: { type: String, required: true },
        src_description: { type: String, default: '' },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, resourceSchema);
