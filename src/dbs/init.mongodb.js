'use strict';

const mongoose = require('mongoose');

const { countConnect } = require('../helpers/check.connect');
const { db } = require('../configs/config');

const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        // if (1 === 1) {
        //     mongoose.set('debug', true);
        //     mongoose.set('debug', { color: true });
        // }

        mongoose
            .connect(connectString)
            .then(() => {
                console.log('Connected to Mongodb');
                countConnect();
            })
            .catch((err) => console.log('MongoDB Error:: ', err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
