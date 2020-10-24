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

    it('responds with 201 auth/register and message success ', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                email: "blabla@bla.com",
                password: "hjdlajksd!33",
            }
        });
        let response = JSON.parse(res.payload);
        expect(res.statusCode).to.equal(201);
        expect(response.message).to.equal("Success!!");
    });
});
