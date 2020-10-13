const Reactions = require('../models/reactions');
const Joi = require("joi");
const Boom = require("@hapi/boom");

async function verifyUniqueReaction(req, h) {
    const condition = {
        userId: req.auth.credentials.id
    };
    if( req.payload.thread_id ) {
        condition['threadId'] = req.payload.thread_id;
    }
    if( req.payload.post_id ) {
        condition['postId'] = req.payload.post_id;
    }

    const reaction = await Reactions.findOne({
        $or: [condition]
    });
    if (reaction !== null && reaction.userId == req.auth.credentials.id) {
        throw Boom.badRequest("Already Reacted!");
    }
    return req;
}


module.exports = [
    {
        method: 'POST',
        path: '/react',
        handler: async function(request, h){
            let reaction = new Reactions();

            reaction.reactionTypeId = request.payload.reaction_type_id;
            reaction.userId = request.auth.credentials.id;
            reaction.threadId = (request.payload.thread_id) ? request.payload.thread_id : null;
            reaction.postId = (request.payload.post_id) ? request.payload.post_id : null;

            try {
                await reaction.save((err, post) => {
                    if (err) {
                      throw Boom.badRequest(err);
                    }
                    return reaction;
                });
                return h.response({
                    error : 0, 
                    message: "Success!!", 
                    data: {
                        reactionId: reaction._id,
                    }
                }).code(201)   
            } catch(err) {
                throw Boom.badRequest(err);
            }
        },
        options: {
            auth: 'jwt',
            description: 'Submit User Reaction',
            notes: 'Returns Success or Error if already exist.',
            tags: ['api', 'reactions', 'create'],
            pre: [
                { method: verifyUniqueReaction }
            ],
            validate: {
                payload: Joi.object({
                    reaction_type_id: Joi.string().required(),
                    thread_id: Joi.string(),
                    post_id: Joi.string(),
                }).or('thread_id', 'post_id')
            }
        }
    }
]