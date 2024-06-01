'use strict';

const Redis = require('ioredis');
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
        vn: 'IORedis lỗi rồi anh em ơi!',
        en: 'IORedis service connection error!',
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
        console.log(`Connection ioredis - Connection status: Connected`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`Connection ioredis - Connection status: Disconnected`);
        // Retry the connection
        handleErrorTimeout();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`Connection ioredis - Connection status: Reconnecting`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`Connection ioredis - Connection status: ${error}`);
        // Retry the connection
        handleErrorTimeout();
    });
};

const init = ({ IOREDIS_IS_ENABLED, IOREDIS_HOST = process.env.REDIS_CACHE_HOST, IOREDIS_PORT = 6379 }) => {
    if (!IOREDIS_IS_ENABLED) return;

    const instantRedis = new Redis({
        host: IOREDIS_HOST,
        port: IOREDIS_PORT,
    });
    client.instantConnect = instantRedis;
    handleEventConnect(instantRedis);
};

const getIORedis = () => client;

// Close redis connection
const closeIORedis = async () => {
    if (Object.keys(client).length > 0) {
        return await client.quit();
    }
};

module.exports = {
    init,
    getIORedis,
    closeIORedis,
};
