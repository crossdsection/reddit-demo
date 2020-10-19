const Posts = require("../models/posts");
const Threads = require("../models/threads");
const ObjectId = require('mongoose').Types.ObjectId; 
const Joi = require("joi");
const Boom = require("@hapi/boom");

const { updateReplyCount } = require("../utils/notification");

async function verifyParentExist(req, h) {
    if( req.payload.thread_id ) {
        if( !ObjectId.isValid(req.payload.thread_id) ) {
            throw Boom.badRequest("Invalid thread id!");
        }

        const threads = await Threads.find({
            _id: req.payload.thread_id
        });

        if (threads !== null && threads.length > 0) {
            return req;
        } else {
            throw Boom.badRequest("Thread Not Found!");
        }
    }
    if( req.payload.parent_post_id ) {
        if( !ObjectId.isValid(req.payload.parent_post_id) ) {
            throw Boom.badRequest("Invalid post id!");
        }

        const post = await Posts.find({
            _id: req.payload.parent_post_id
        });

        if (post !== null && post.length > 0) {
            return req;
        } else {
            throw Boom.badRequest("Thread Not Found!");
        }
    }
}


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
            
                if( post.threadId != null )  updateReplyCount({threadId: post.threadId});

                if( post.parentPostId != null )  updateReplyCount({postId: post.parentPostId});

                updateReplyCount({postId: post._id});

                const responseData = {
                    content: post.content,
                    postId: post._id,
                };
                return h.response({error : 0, message: "Success!!", data: responseData}).code(201)   
            } catch(err) {
                throw Boom.badRequest(err);
            }
        },
        options: {
            auth: 'jwt',
            description: 'Create Posts',
            notes: 'POST API - Create Posts\n\nHEADER - Authorization : <token returned at login>\n\nPOST DATA - \n\nEither parent_post_id or thread_id to be sent.\n\n{\n  \"content\": \"First Post on Second Thread\",\n  \"parent_post_id\": \"5f8bf866f1ec050014e82e42\", \n  \"thread_id\": \"5f8bf866f1ec050014e82e42\"\n}\n\nRESPONSE\n{\n    \"error\": 0,\n    \"message\": \"Success!!\",\n    \"data\": {\n        \"content\": \"First Post on Second Thread\",\n        \"postId\": \"5f8bf86ef1ec050014e82e43\"\n    }\n}',
            tags: ['api', 'posts', 'create'],
            pre: [
                { method: verifyParentExist }
            ],
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