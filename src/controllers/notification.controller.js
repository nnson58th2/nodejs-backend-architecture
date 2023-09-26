'use strict';

const { OK } = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        const payload = {
            ...req.query,
        };

        const result = await NotificationService.listNotiByUser(payload);

        new OK({
            message: 'Get the list of successful notifications',
            metadata: result,
        }).send(res);
    };
}

module.exports = new NotificationController();
