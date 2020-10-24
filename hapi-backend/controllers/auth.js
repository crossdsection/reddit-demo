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
            const response = await new Promise((resolve, reject) => {
              bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
                if (isValid) {
                  resolve(createToken(user));
                } else {
                  reject(Boom.badRequest('Incorrect password!'));
                }
              });
            });
            if( response.isBoom ) {
              return h.response(response.output.payload).code(201);
            }
            return h.response({error : 0, message:"Success!!", token: response}).code(201);
          } 
          
          throw Boom.badRequest('Incorrect username or email!');
        },
        options: {
            auth: false,
            description: 'Login API',
            notes: 'POST API - Login Using this API, and use the response token as header Authorization in non-authentication APIS.\n\nPOST DATA \n\n{\n    \"email\": <valid>,\n    \"password\": text\n}\n\nRESPONSE - \n\n{\n    \"error\": 0,\n    \"message\": \"Success\",\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOGMzNjM0Y2YyMjE3MDAxMzRmNzZkMyIsInVzZXJuYW1lIjoiYWRAYmxhLmNvbSIsImRhdGUiOiIyMDIwLTEwLTE4VDEyOjM0OjE0LjkwNFoiLCJpYXQiOjE2MDMwMjQ0NTQsImV4cCI6MTYwMzAyODA1NH0.Xyqgkq9dUWe3XYZhLC7c_apZ9tBIQnnUg7VV59Q-oPE\"\n}',
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
        notes: 'POST API - Register a user using this API\n\nPOST DATA\n\n{\n    \"email\" : <valid>\n    \"password\" : <valid>\n}\n\nRESPONSE\n\n{\n    \"error\": 0,\n    \"message\": \"Success!!\"\n}',
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