'use strict';

const { RedisErrorResponse } = require('../../core/error.response');

const { getIORedis } = require('../../dbs/init.ioredis');

const setCacheIO = async (key, value) => {
    const redisCache = getIORedis().instantConnect;
    if (!redisCache) throw new RedisErrorResponse({ message: 'IORedis client not initialized' });

    try {
        return await redisCache.set(key, value, options);
    } catch (error) {
        console.error(`Error set key ${key} from IORedis: `, error.message);
        return null;
    }
};

const setCacheIOExpiration = async ({ key, value, expirationInSeconds }) => {
    const redisCache = getIORedis().instantConnect;
    if (!redisCache) throw new RedisErrorResponse({ message: 'IORedis client not initialized' });

    try {
        return await redisCache.set(key, value, 'EX', expirationInSeconds);
    } catch (error) {
        console.error(`Error set expiration key ${key} from IORedis: `, error.message);
        return null;
    }
};

const getCacheIO = async (key) => {
    const redisCache = getIORedis().instantConnect;
    if (!redisCache) throw new RedisErrorResponse({ message: 'IORedis client not initialized' });

    try {
        return await redisCache.get(key);
    } catch (error) {
        console.error(`Error get key ${key} from IORedis: `, error.message);
        return null;
    }
};

module.exports = {
    setCacheIO,
    setCacheIOExpiration,
    getCacheIO,
};
