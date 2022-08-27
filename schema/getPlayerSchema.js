const joi = require('Joi')

const getSchema = (req, res, next) => {
    const schema = joi.object({
        teamId: joi.string().optional(),
        playerName: joi.string().optional(),
        role: joi.string().valid('BATSMAN', 'BOWLER', 'ALL ROUNDER', 'WICKET KIPPER').optional(),
        age: joi.number().min(16).max(40).optional(),
        score: joi.number().min(0).optional(),
        wicket: joi.number().min(0).optional()
    })
    let { error } = schema.validate(req.query)

    if(!error) return next()

    const errorMess = error.details[0].message
    res.status(400).json({ status: 400, message: errorMess })
}

module.exports = getSchema
