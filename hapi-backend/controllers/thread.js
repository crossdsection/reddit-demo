const UserModel = require('../models/threads');
const Joi = require("joi");
const Boom = require("@hapi/boom");

module.exports = [
    {
        method: 'POST',
        path: '/thread/create',
        config: {
            description: 'Create Threads',
            notes: 'Returns created object with ID',
            tags: ['api', 'threads', 'create'],
            handler: function(request, h){
                throw Boom.notFound();
            }
        }
    }
]