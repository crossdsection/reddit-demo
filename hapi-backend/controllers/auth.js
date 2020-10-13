const UserModel = require('../models/users');
const Joi = require("joi");
const Boom = require("@hapi/boom");

module.exports = [
    {
        method: 'POST',
        path: '/login',
        config: {
            description: 'Login API',
            notes: 'Return Access Token',
            tags: ['api', 'login'],
            handler: function(request, h){
                throw Boom.notFound();
            }
        }
    }, 
    {
        method: 'POST',
        path: '/register',
        config: {
            description: 'Register API',
            notes: 'Validate and Register User',
            tags: ['api', 'register'],
            handler: function(request, h){
                throw Boom.notFound();
            }
        }
    }
]