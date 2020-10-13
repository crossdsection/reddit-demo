const User = require('../models/users');
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
        config: {
            auth: false,
            description: 'Login API',
            notes: 'Return Access Token',
            tags: ['api', 'login'],
            handler: function(request, h){
                throw Boom.notFound();
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
        
        return h.response(user).code(201);

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