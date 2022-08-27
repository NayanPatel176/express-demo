const joi = require('Joi')

const deletePlayerSchema = (req, res, next) => {
    const schema = joi.object({
        id: joi.string().min(24).max(24).required()
    })
    let { error } = schema.validate(req.params)

    if(!error) return next()

    const errorMess = error.details[0].message
    res.status(400).json({ status: 400, message: errorMess })
}

module.exports = deletePlayerSchema
