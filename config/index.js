module.exports = {
    server: {
        port: process.env.PORT || 7007,
        host: process.env.HOST || '127.0.0.1',
        protocol: process.env.PROTOCOL || 'http',
    },
    mongodb: {
        db: process.env.DB_NAME || "example",
        host: process.env.DB_HOST || "mongodb://localhost:27018",
        options: {
            autoReconnect: true,
            reconnectTries: 1000,
            reconnectInterval: 100,
            useNewUrlParser: true,
        },
    }
};
