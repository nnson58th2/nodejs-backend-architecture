'use strict';

const mysql = require('mysql2');

// Create connection to pool server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sonnguyen',
    password: '12345',
    database: 'shopDEV',
});

const batchSize = 100_000; // adjust batch size
const totalSize = 1_000_000; // adjust total size
let currentId = 1;

console.time('-----TIMER-----');
const insertBatch = async () => {
    const values = [];

    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd('-----TIMER-----');
        pool.end((err) => {
            if (err) {
                console.log(`Error occurred while running batch`);
            } else {
                console.log(`Connection pool closed successfully`);
            }
        });
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

    pool.query(sql, [values], async (error, results, fields) => {
        if (error) throw error;
        console.log(`Inserted ${results.affectedRows} records`);
        await insertBatch();
    });
};

insertBatch().catch((error) => console.error(`Error::${error}`));

// Perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
//     if (error) throw error;
//     console.log(`Query result`, results);

//     // Close pool connection
//     pool.end((error) => {
//         if (error) throw error;
//         console.log('Connection closed');
//     });
// });

// pool.query('SELECT * from users', (error, results, fields) => {
//     if (error) throw error;
//     console.log(`Query result`, results);

//     // Close pool connection
//     pool.end((error) => {
//         if (error) throw error;
//         console.log('Connection closed');
//     });
// });
