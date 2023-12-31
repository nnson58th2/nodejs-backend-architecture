'use strict';

const Redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');

const redisClient = Redis.createClient();

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error:: ', err));
redisClient.connect();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_checkout_productID_${productId}`;
    const retryTime = 10;
    const expireTime = 3000; // 3 seconds tạm lock

    for (let i = 0; i < retryTime; i++) {
        // Tạo 1 key, thằng nào nắm giữ được vào thanh toán
        const result = await setNXAsync(key, expireTime);
        console.log('result :>> ', result);

        if (result === 1) {
            // Thao tác với inventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime);
                return key;
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLook = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLook,
};
