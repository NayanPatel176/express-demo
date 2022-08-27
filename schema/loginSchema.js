const joi = require('Joi')
const loginSchema = (req, res, next) => {
   const schema =  joi.object({
    userName: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()
   })
   const { error } = schema.validate(req.body)
   if(!error) return next()
   const message = error.details[0].message
   res.status(400).json({ status: 400, message }) 
}
module.exports = loginSchema