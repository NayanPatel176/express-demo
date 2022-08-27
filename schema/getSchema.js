const joi = require('Joi')

const getSchema = (req, res, next) => {
    const schema = joi.object({
        teamName: joi.string().optional(),
        type: joi.string().valid('INTERNATIONAL', 'DOMESTIC').optional(),
        country: joi.string().optional()
    })
    let { error } = schema.validate(req.query)

    if(!error) return next()

    const errorMess = error.details[0].message
    res.status(400).json({ status: 400, message: errorMess })
}

module.exports = getSchema
