'use strict';

const amqp = require('amqplib');

const messages = `Hello RabbitMQ user by Son Nguyen!`;

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        });

        // Send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(messages));
        console.log(`Message sent:: `, messages);
    } catch (error) {
        console.error('Run producer rabbitMQ error:: ', error);
    }
};

runProducer().catch(console.error);
