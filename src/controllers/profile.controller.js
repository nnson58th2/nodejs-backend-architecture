'use strict';

const { OK } = require('../core/success.response');

const dataProfiles = [
    {
        usr_id: 1,
        usr_name: 'CR7',
        usr_avatar: 'http://image.com/user/1',
    },
    {
        usr_id: 2,
        usr_name: 'M10',
        usr_avatar: 'http://image.com/user/2',
    },
    {
        usr_id: 3,
        usr_name: 'TIPJS',
        usr_avatar: 'http://image.com/user/3',
    },
];

const dataProfile = {
    usr_id: 3,
    usr_name: 'TIPJS',
    usr_avatar: 'http://image.com/user/3',
};

class ProfileController {
    // Admin
    profiles = async (req, res, next) => {
        new OK({
            message: 'View all profiles',
            metadata: dataProfiles,
        }).send(res);
    };

    // Shop
    profile = async (req, res, next) => {
        new OK({
            message: 'View one profile',
            metadata: dataProfile,
        }).send(res);
    };
}

module.exports = new ProfileController();
