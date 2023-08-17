const app = require('./src/app');
const {
    app: { port },
} = require('./src/configs/config');

const server = app.listen(port, () => {
    console.log(`Web Service eCommerce start with ${port}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(` Exist server express`));
});
