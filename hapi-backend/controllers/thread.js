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

            updateReplyCount(JSON.stringify({threadId: thread._id}));
            
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
            notes: 'Returns created object with ID',
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