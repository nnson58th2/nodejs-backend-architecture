'use strict';

const amqp = require('amqplib');

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'; // notificationEx direct
        const notificationQueue = 'notificationQueueProcess'; // assertQueue
        const notificationExchangeDLX = 'notificationExDLX'; // notificationExDLX direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        // 1. Create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true,
        });

        // 2. Create queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false, // Cho phép các kết nối truy cập vào cùng một lúc hàng đợi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        });

        // 3. binQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // 4. Send messages
        const messages = `Create a new product by shop Son Nguyen`;
        console.log(`Producer msg:: `, messages);
        await channel.sendToQueue(queueResult.queue, Buffer.from(messages), {
            expiration: '10000',
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Run producerDLX rabbitMQ error:: ', error);
    }
};

runProducer().catch(console.error);
