const Redis = require("redis");
const Queue = require("bee-queue");
const config = require("../config")

if( process.env.REDIS_HOST ) config.redisURL = "redis://" + process.env.REDIS_HOST + ":" + process.env.REDIS_PORT;

const sharedConfig = {
    redis: config.redisURL,
    isWorker: false,
    getEvents: false
};

const replyQueue = new Queue('REPLY_COUNT', sharedConfig);
const reactionQueue = new Queue('REACTION_COUNT', sharedConfig);
  
function updateReplyCount(messageData) {
    const job = replyQueue.createJob(messageData)
    return job.save()
}
  
function updateReactionCount(data) {
    const job = reactionQueue.createJob(data)
    return job.save()
}

module.exports = { updateReplyCount, updateReactionCount };