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
            notes: 'GET API - Get available reaction types\n\nHEADER - Authorization : <token returned at auth/login>\n\nResponse -\n\n{\n    \"error\": 0,\n    \"message\": \"Success!!\",\n    \"data\": [\n        {\n            \"_id\": \"5f8c35460cabdba16e25d698\",\n            \"codes\": \"1F44E\",\n            \"char\": \"👎\",\n            \"name\": \"thumbs down\",\n            \"category\": \"People & Body (hand-fingers-closed)\",\n            \"group\": \"People & Body\",\n            \"subgroup\": \"hand-fingers-closed\"\n        },\n        {\n            \"_id\": \"5f8c35460cabdba16e25d699\",\n            \"codes\": \"1F44D\",\n            \"char\": \"👍\",\n            \"name\": \"thumbs up\",\n            \"category\": \"People & Body (hand-fingers-closed)\",\n            \"group\": \"People & Body\",\n            \"subgroup\": \"hand-fingers-closed\"\n        },\n        {\n            \"_id\": \"5f8c35460cabdba16e25d69a\",\n            \"codes\": \"1F4AF\",\n            \"char\": \"💯\",\n            \"name\": \"hundred points\",\n            \"category\": \"Smileys & Emotion (emotion)\",\n            \"group\": \"Smileys & Emotion\",\n            \"subgroup\": \"emotion\"\n        }\n    ]\n}',
            tags: ['api', 'reaction', 'get']
        }
    }
]