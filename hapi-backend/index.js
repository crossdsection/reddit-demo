'use strict';
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiJwt2 = require('hapi-auth-jwt2');
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

    server.route(Routes);
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        HapiJwt2
    ]);
    server.auth.strategy('jwt', 'jwt', { 
        key: 'NeverShareYourSecret', 
        validate() {
            return true;
        }
    });

    server.auth.default('jwt');

    await Mongoose.connect('mongodb://localhost/reddit-demo', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
        if (err) {
            throw err;
        }
    });

    await server.start((err) => {
        if (err) {
            throw err;
        }
    });
        
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();