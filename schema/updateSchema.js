const joi = require('Joi')

const getSchema = (req, res, next) => {
    const schema = joi.object({
        teamId: joi.string().required(),
        teamName: joi.string().optional(),
        type: joi.string().valid('INTERNATIONAL', 'DOMESTIC').optional(),
        country: joi.string().optional()
    })
    let { error } = schema.validate(req.body)

    if(!error) return next()

    const errorMess = error.details[0].message
    res.status(400).json({ status: 400, message: errorMess })
}

module.exports = getSchema
