const joi = require('Joi')

const createTeam = (req, res, next) => {
    const schema = joi.object({
        teamId: joi.string().min(24).max(24).required(),
        opponentTeamId: joi.string().min(24).max(24).required(),
        scheduleTime: joi.string().required(),
        scheduleEndTime: joi.string().required(),
        venue: joi.string().required(),
        score: joi.number().min(0).default(0).optional(),
        opponentTeamScore: joi.number().min(0).default(0).optional(),
        wicket: joi.number().min(0).default(0).optional(),
        opponentTeamWicket: joi.number().min(0).default(0).optional()
    })
    const { error } = schema.validate(req.body)
    if(!error) return next()
    res.status(400).json({ status: 400, message: error.details[0].message })
}

module.exports = createTeam