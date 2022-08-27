const joi = require('Joi')

const createTeam = (req, res, next) => {
    const schema = joi.object({
        teamId: joi.string().required(),
        playerName: joi.string().required(),
        role: joi.string().valid('BATSMAN', 'BOWLER', 'ALL ROUNDER', 'WICKET KIPPER').required(),
        age: joi.number().min(16).max(40).required(),
        score: joi.number().min(0).default(0).optional(),
        wicket: joi.number().min(0).default(0).optional()
    })
    const { error } = schema.validate(req.body)
    if(!error) return next()
    res.status(400).json({ status: 400, message: error.details[0].message })
}

module.exports = createTeam