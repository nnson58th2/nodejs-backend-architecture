'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectId = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const removeUndefinedNullObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }

        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            removeUndefinedNullObject(obj[key]);
        }
    });

    return obj;
};

const updateNestedObjectParser = (obj) => {
    const final = {};

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);

            Object.keys(response).forEach((key2) => {
                final[`${key}.${key2}`] = response[key2];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
    convertToObjectId,
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedNullObject,
    updateNestedObjectParser,
};
