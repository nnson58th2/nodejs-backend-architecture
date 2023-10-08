'use strict';

const mysql = require('mysql2');

// Create connection to pool server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sonnguyen',
    password: '12345',
    database: 'shopDEV',
});

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

pool.query('SELECT * from users', (error, results, fields) => {
    if (error) throw error;
    console.log(`Query result`, results);

    // Close pool connection
    pool.end((error) => {
        if (error) throw error;
        console.log('Connection closed');
    });
});
