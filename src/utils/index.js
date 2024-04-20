'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectId = (id) => new Types.ObjectId(id);

const randomImageName = () => crypto.randomBytes(16).toString('hex');

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

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((key) => {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), params[key]);
    });

    return template;
};

const randomProductId = () => {
    return Math.floor(Math.random() * 899999 + 100000);
};

module.exports = {
    convertToObjectId,
    randomImageName,
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedNullObject,
    updateNestedObjectParser,
    replacePlaceholder,
    randomProductId,
};
