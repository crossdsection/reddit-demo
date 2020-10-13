'use strict';
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Mongoose = require('mongoose');
const Routes = require('./controllers/index');

const swaggerOptions = {
    info: {
        title: 'Books API Documentation',
        version: '0.0.1',
    }
};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    Mongoose.connect('mongodb://localhost/reddit-demo', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = Mongoose.connection;

    server.route(Routes);
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();