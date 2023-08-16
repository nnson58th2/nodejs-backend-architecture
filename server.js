const app = require('./src/app');

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
    console.log(`Web Service eCommerce start with ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(` Exist server express`));
});
