'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../server');

describe('API Testing', () => {
    let server, token, reactionTypes, threadId, postId;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    describe('Doesn\'t work without authorization token', () => {
        it('responds with 401 reactiontype/get - without ', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/reactiontype/get'
            });
            expect(res.statusCode).to.equal(401);
        });
    });

    describe('Email already registered', () => {
        it('responds with 400 auth/register and message Email taken!', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/auth/register',
                payload: {
                    email: "blabla@bla.com",
                    password: "hjdlajksd!33",
                }
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Email taken!");
        });
    })
    describe('Invalid Email Address', () => {
        it('responds with 400 auth/register and error message ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/auth/register',
                payload: {
                    email: "blabla",
                    password: "hjdlajksd!33",
                }
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Invalid request payload input");
        });
    });
    
    describe('Failed login - incorrect password', () => {
        it('responds with 400 auth/login and message Incorrect password ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: "blabla@bla.com",
                    password: "hjdlajksd",
                }
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Incorrect password!");
            token = response.token;
        });
    });

    describe('Successful login and token received', () => {
        it('responds with 201 auth/login and message success ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: "blabla@bla.com",
                    password: "hjdlajksd!33",
                }
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
            token = response.token;
        });
    });

    describe('Reaction types received with correct token', () => {
        it('responds with 201 reactiontype/get and error message success ', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/reactiontype/get',
                headers: {
                    "Authorization" : token
                }              
            });
            const response = JSON.parse(res.payload);
            reactionTypes = response.data;
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
        });
    });
    
    describe('Thread Creation Failed - Invalid Input', () => {
        it('responds with 400 thread/create and message Invalid payload input ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/thread/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "title": "This is a new thread title"
                }              
            });
            const response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Invalid request payload input");
        });
    });
    
    describe('Thread Created Successfully', () => {
        it('responds with 201 thread/create and error message success ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/thread/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "title": "This is a new thread title",
                    "content": "This is a thread content"
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
            threadId = response.data.threadId; 
        });
    });

    describe('Post Created Successfully', () => {
        it('responds with 201 post/create and error message success ', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/post/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "thread_id": threadId,
                    "content": "This is a post content 1"
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
            postId = response.data.postId;
        });
    });

    describe('Invalid Post body submitted!', () => {
        it('Invalid /post/create both threadId and ParentPostId passed', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/post/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "thread_id": threadId,
                    "parent_post_id": postId,
                    "content": "This is a post content 2"
                }              
            });
            let response = JSON.parse(res.payload);
    
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Invalid request payload input");
        });    
    });
    
    describe('Post created on a post successfully!', () => {
        it('POST /post/create', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/post/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "parent_post_id": postId,
                    "content": "This is a post content 3"
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
        });
    });

    describe('Post created on a post successfully!', () => {
        it('POST /post/create', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/post/create',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "parent_post_id": postId,
                    "content": "This is a post content 4"
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
        });
    });
    
    describe('Reacted on thread successfully!', () => {
        it('POST /react', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/react',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "reaction_type_id": reactionTypes[0]._id,
                    "thread_id": threadId
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
        });
    });


    describe('Reacted on Post successfully!', () => {
        it('POST /react', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/react',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "reaction_type_id": reactionTypes[0]._id,
                    "post_id": postId
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(201);
            expect(response.message).to.equal("Success!!");
        });
    });

    describe('Multiple reaction on same thread failed!', () => {
        it('POST /react', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/react',
                headers: {
                    "Authorization" : token
                },
                payload: {
                    "reaction_type_id": reactionTypes[1]._id,
                    "thread_id": threadId
                }              
            });
            let response = JSON.parse(res.payload);
            expect(res.statusCode).to.equal(400);
            expect(response.message).to.equal("Already Reacted!");
        });
    });
});
