'use strict';
const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queue-message';
    await channel.assertQueue(queueName, {
        durable: true,
    });

    // Set prefetch to 1 to ensure only one ack at a time
    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log(`Process:: ${message}`);
            channel.ack(msg);
        }, Math.random() * 1000);
    });

    setTimeout(() => {
        connection.close();
    }, 10000);
}

consumerOrderedMessage().catch((error) => console.error(`producerOrderedMessage:: `, error));
