'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const SECONDS = 30000;

// Count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connection(${numConnection})`);
};

// Check over load connect
const checkOverLoadConnect = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections based on number osf cores
        const maxConnections = numCores * 5;
        const memoryCalculate = (memoryUsage / 1024 / 1024).toFixed(2);

        console.log(`Memory usage:: ${memoryCalculate} MB`);

        if (numConnection > maxConnections) {
            console.log('Connection overload detected!');
        }
    }, SECONDS); // Monitor every 5 seconds
};

module.exports = {
    countConnect,
    checkOverLoadConnect,
};
