'use strict';

const Redis = require('redis');
const { RedisErrorResponse } = require('../core/error.response');

const client = {};
const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
};
const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis lỗi rồi anh em ơi!',
        en: 'Redis service connection error',
    },
};

let connectionTimeout = null;

const handleErrorTimeout = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            statusCode: REDIS_CONNECT_MESSAGE.code,
            message: REDIS_CONNECT_MESSAGE.message.vn,
        });
    }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = (connectionRedis) => {
    // Check if connection is null
    if (connectionRedis == null) return;

    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`Connection redis - Connection status: Connected`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`Connection redis - Connection status: Disconnected`);
        // Retry the connection
        handleErrorTimeout();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`Connection redis - Connection status: Reconnecting`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`Connection redis - Connection status: ${error}`);
        // Retry the connection
        handleErrorTimeout();
    });

    connectionRedis.connect();
};

const initRedis = () => {
    const instantRedis = Redis.createClient();
    client.instantConnect = instantRedis;
    handleEventConnect(instantRedis);
};

const getRedis = () => {
    return client;
};

// Close redis connection
const closeRedis = () => {};

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
};
