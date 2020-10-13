const Posts = require('../models/posts');
const Joi = require("joi");
const Boom = require("@hapi/boom");

module.exports = [
    {
        method: 'POST',
        path: '/post/create',
        handler: async function(request, h){
            let post = new Posts();

            post.content = request.payload.content;
            post.threadId = ( request.payload.thread_id )  ? request.payload.thread_id : null;
            post.parentPostId = ( request.payload.parent_post_id )  ? request.payload.parent_post_id : null;
            post.userId = request.auth.credentials.id;

            try {
                await post.save((err, post) => {
                    if (err) {
                      throw Boom.badRequest(err);
                    }
                    return post;
                });
    
                const responseData = {
                    content: post.content,
                    postId: post._id,
                };
                return h.response({"error" : 0, message: "Success!!", data: responseData}).code(201)   
            } catch(err) {
                throw Boom.badRequest(err);
            }
        },
        options: {
            auth: 'jwt',
            description: 'Create Posts',
            notes: 'Returns created object with ID',
            tags: ['api', 'posts', 'create'],
            validate: {
                payload: Joi.object({
                    content: Joi.string().required(),
                    thread_id: Joi.string(),
                    parent_post_id: Joi.string(),
                }).or('thread_id', 'parent_post_id')
            }
        }
    }
]