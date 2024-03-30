'use strict';

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'email-smtp.ap-south-1.amazonaws.com',
    post: 465,
    secure: true,
    auth: {
        user: 'AKIA4SW7WGZBCLIDGPGC',
        pass: 'BK9TllDhe+6nBtD27dpJSAM+gTTL+vJ2imrVS+OqfLYk',
    },
});

module.exports = transport;
