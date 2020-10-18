'use strict';
const Mongoose = require('mongoose');
const config = require('./config');
const Queue = require('bee-queue');
const Redis = require('redis');

const updateReplyCount = require('./controllers/replycount');
const updateReactionCount = require('./controllers/reactioncount');

if( process.env.REDIS_HOST ) config.redisURL = "redis://" + process.env.REDIS_HOST + ":" + process.env.REDIS_PORT;
if( process.env.MONGODB_HOST ) config.dbURL = "mongodb://" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/reddit-demo";

console.log(config.redisURL);
console.log(config.dbURL);

Mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        throw err;
    }
});

const sharedConfig = {
    getEvents: true,
    isWorker: true,
    redis: Redis.createClient( config.redisURL ),
};

const replyCountQueue = new Queue('REPLY_COUNT', sharedConfig);
const reactionCountQueue = new Queue('REACTION_COUNT', sharedConfig);  

replyCountQueue.process(async (job) => {
    await updateReplyCount( job.data );
});

reactionCountQueue.process(async (job) => {
    await updateReactionCount( job.data );
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});