'use strict';

const { BadRequestError } = require('../core/error.response');
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

    uploadImageFromLocal = async (req, res, next) => {
        const { file } = req;
        if (!file) throw new BadRequestError('File missing from local storage!');

        const result = await UploadService.uploadImageFromLocal({
            path: file.path,
        });

        new OK({
            message: 'File uploaded successfully.',
            metadata: result,
        }).send(res);
    };
}

module.exports = new UploadController();
