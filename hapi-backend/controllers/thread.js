const Threads = require('../models/threads');
const { updateReplyCount } = require("../utils/notification");

const Joi = require("joi");
const Boom = require("@hapi/boom");

module.exports = [
    {
        method: 'POST',
        path: '/thread/create',
        handler: async function(request, h){
            let thread = new Threads();
            thread.title = request.payload.title;
            thread.content = request.payload.content;
            thread.userId = request.auth.credentials.id;
            await thread.save((err, thread) => {
                if (err) {
                  throw Boom.badRequest(err);
                }
                return thread;
            });

            updateReplyCount({threadId: thread._id});
            
            const responseData = {
                title: thread.title,
                content: thread.content,
                threadId: thread._id,
            };
            return h.response({error : 0, message: "Success!!", data: responseData}).code(201)
        },
        options: {
            auth: 'jwt',
            description: 'Create Threads',
            notes: 'POST API - Create Threads \n\nHeader - Authorization: <token returned at login>\n\nPOST DATA - \n\n{\n  \"title\": \"This is a new thread title\",\n  \"content\": \"This is a thread content\"\n}\n\nRESPONSE -\n\n{\n    \"error\": 0,\n    \"message\": \"Success!!\",\n    \"data\": {\n        \"title\": \"This is a new thread title\",\n        \"content\": \"This is a thread content\",\n        \"threadId\": \"5f8bf85bf1ec050014e82e3e\"\n    }\n}',
            tags: ['api', 'threads', 'create'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    content: Joi.string().required()
                })          
            }
        }
    }
]