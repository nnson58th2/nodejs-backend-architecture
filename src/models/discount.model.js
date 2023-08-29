'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discountShopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
        discountName: { type: String, require: true },
        discountDescription: { String, require: true },
        discountType: {
            type: String,
            enum: ['FIXED_AMOUNT', 'PERCENTAGE'],
            default: 'FIXED_AMOUNT',
        },
        discountValue: { type: Number, require: true },
        discountCode: { type: String, require: true },
        discountStartAt: { type: Date, require: true },
        discountEndAt: { type: Date, require: true },
        discountMaxUses: { type: Number, require: true }, // Số lượng discount được áp dụng
        discountUsesCourse: { type: Number, require: true }, // Số discount đã sử dụng
        discountUsersUsed: { type: Array, default: [] }, // Những users đã sử dụng discount
        discountMaxUsesPerUser: { type: Number, require: true }, // Số lượng cho phép tối đã được dùng
        discountMinOrderValue: { type: Number, require: true }, // Tối thiếu tổng giá trị đơn hàng
        discountIsActive: { type: Boolean, default: true },
        discountAllowForSuggestion: { type: Boolean, default: true }, // Cho phép hiển thị ở nhiều nơi
        discountAppliesTo: {
            type: string,
            enum: ['ALL', 'SPECIFIC'],
            default: 'ALL',
        },
        discountProductIds: { type: Array, default: [] }, // Số sản phẩm dược áp dụng
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
