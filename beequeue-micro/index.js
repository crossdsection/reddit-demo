'use strict';
const Mongoose = require('mongoose');
const config = require('./config');
const Queue = require('bee-queue');
const Redis = require('redis');

const updateReplyCount = require('./controllers/replycount');

Mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        throw err;
    }
});

const sharedConfig = {
    getEvents: true,
    isWorker: true,
    redis: Redis.createClient(config.REDIS_URL),
};

const replyCountQueue = new Queue('REPLY_COUNT', sharedConfig);
const reactionCountQueue = new Queue('REACTION_COUNT', sharedConfig);  

replyCountQueue.process(async (job) => {
    const param = JSON.parse(job.data);
    await updateReplyCount( param );
});

reactionCountQueue.process((job) => {
    console.log(job);
    // const param = {
    //     postId : data._id
    // }
    // updateReplyCount( param );
});

process.on('unhandledRejection', (err) => {
    process.exit(1);
});