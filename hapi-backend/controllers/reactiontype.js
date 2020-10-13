const ReactionTypes = require('../models/reactiontypes');
const Joi = require("joi");
const Boom = require("@hapi/boom");

module.exports = [
    {
        method: 'get',
        path: '/reactiontype/get',
        handler: async function(request, h){
            const reactionTypes = await ReactionTypes.find();
            return h.response({error : 0, message: "Success!!", data: reactionTypes}).code(201)
        },
        options: {
            auth: 'jwt',
            description: 'Get Available Reaction Types',
            notes: 'Returns reaction records available',
            tags: ['api', 'reaction', 'get']
        }
    }
]