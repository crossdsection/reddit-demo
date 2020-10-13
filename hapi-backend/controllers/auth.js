const User = require('../models/users');
const createToken = require('../utils/token');

const Joi = require("joi");
const Boom = require("@hapi/boom");
const bcrypt = require('bcrypt');
 
async function hashPassword(password, cb) {
    const hash = await new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    });
    return hash;
}

async function verifyUniqueUser(req, h) {
    const user = await User.findOne({
        $or: [{email: req.payload.email}]
    });
    if (user !== null && user.email === req.payload.email) {
        throw Boom.badRequest("Email taken!");
    }
    return req;
}


module.exports = [
    {
        method: 'POST',
        path: '/auth/login',
        handler: async function(request, h){
          const user = await User.findOne({
            $or: [
              { email: request.payload.email }
            ]
          });
          
          if (user) {
            const token = await new Promise((resolve, reject) => {
              bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
                if (isValid) {
                  resolve(createToken(user));
                } else {
                  throw Boom.badRequest('Incorrect password!');
                }
              });
            });
            return h.response({error : 0, message:"Success", token: token}).code(201);
          } 
          
          throw Boom.badRequest('Incorrect username or email!');
        },
        options: {
            auth: false,
            description: 'Login API',
            notes: 'Return Access Token',
            tags: ['api', 'login'],
            validate: {
              payload: Joi.object({
                  email: Joi.string().email().required(),
                  password: Joi.string().required()
                })          
            }
        }
    }, 
    {
      method: 'POST',
      path: '/auth/register',
      handler: async function(request, h){
        let user = new User();
        user.email = request.payload.email;
        const hash = await hashPassword(request.payload.password);
        user.password = hash;
        await user.save((err, user) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          return user;
        });
        return h.response({error : 0, message:"Success!!"}).code(201);
      },
      options: {
        auth: false,
        pre: [
          { method: verifyUniqueUser }
        ],
        description: 'Register API',
        notes: 'Validate and Register User',
        tags: ['api', 'register'],
        validate: {
          payload: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().required()
            })          
        }
      }
    }
]