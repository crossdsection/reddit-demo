const ReplyCounts = require('../models/replycounts');
const ObjectId = require('mongoose').Types.ObjectId; 

function updateReplyCount(params){
    const condition = {};
    if( params.threadId ) {
        condition['threadId'] = ObjectId(params.threadId);
    }

    if( params.postId ) {
        condition['postId'] = ObjectId(params.postId);
    }
    
    ReplyCounts.findOne(condition, async function(err, result) {
        if(err) throw err;

        if(result != null) {
            const response = await ReplyCounts.updateOne({ _id : new ObjectId(result._id)}, { count: (result.count + 1) });
            return response;
        } else {
            let replyCount = new ReplyCounts();
            replyCount.count = 0;
            replyCount.threadId = (params.threadId) ? params.threadId : null;
            replyCount.postId = (params.postId) ? params.postId : null;
            replyCount.save((err, result) => {
                if (err) {
                    throw err;
                }
                return result;
            });
        }
    });
}

module.exports = updateReplyCount;