'use strict';

const { OK } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
    uploadImageFromUrl = async (req, res, next) => {
        const result = await UploadService.uploadImageFromUrl();

        new OK({
            message: 'File uploaded successfully.',
            metadata: result,
        }).send(res);
    };
}

module.exports = new UploadController();
