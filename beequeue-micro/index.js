'use strict';
const Mongoose = require('mongoose');
const config = require('./config');
const Queue = require('bee-queue');
const Redis = require('redis');

const updateReplyCount = require('./controllers/replycount');
const updateReactionCount = require('./controllers/reactioncount');

if( process.env.REDIS_HOST ) config.redisURL = "redis://" + process.env.REDIS_HOST + ":" + process.env.REDIS_PORT;
if( process.env.MONGO_HOST ) config.dbURL = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS + "@" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB;

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
    try {
        await updateReplyCount( job.data );
    } catch( err ) {
        console.log(err);
    }
});

reactionCountQueue.process(async (job) => {
    try {
        await updateReactionCount( job.data );
    } catch( err ) {
        console.log(err);
    }
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});