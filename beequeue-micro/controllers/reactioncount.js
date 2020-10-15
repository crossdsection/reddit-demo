const ReactionCounts = require('../models/reactioncounts');
const ObjectId = require('mongoose').Types.ObjectId; 

function updateReactionCount(params){
    const condition = {
        reactionTypeId: params.reactionTypeId
    };
    if( params.threadId ) {
        condition['threadId'] = ObjectId(params.threadId);
    }

    if( params.postId ) {
        condition['postId'] = ObjectId(params.postId);
    }
    console.log(condition, params);
    ReactionCounts.findOne(condition, async function(err, result) {
        if(err) throw err;

        if(result != null) {
            const response = await ReactionCounts.updateOne({ _id : new ObjectId(result._id)}, { count: (result.count + 1), $push: { users: params.user } });
            console.log(response);
        } else {
            let reactionCount = new ReactionCounts();
            reactionCount.count = 1;
            reactionCount.reactionTypeId = params.reactionTypeId;
            reactionCount.threadId = (params.threadId) ? params.threadId : null;
            reactionCount.postId = (params.postId) ? params.postId : null;
            reactionCount.users = [params.user];
            reactionCount.save((err, result) => {
                if (err) {
                    throw err;
                }
                console.log(result)
                return result;
            });
        }
    });
}

module.exports = updateReactionCount;