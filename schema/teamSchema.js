const joi = require('Joi')

const createTeam = (req, res, next) => {
    const schema = joi.object({
        teamName: joi.string().required(),
        type: joi.string().valid('INTERNATIONAL', 'DOMESTIC').required(),
        country: joi.string().required()
    })
    const { error } = schema.validate(req.body)
    if(!error) return next()
    res.status(400).json({ status: 400, message: error.details[0].message })
}

module.exports = createTeam