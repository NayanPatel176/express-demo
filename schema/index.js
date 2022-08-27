const getSchema = require('./getSchema')
const loginSchema = require('./loginSchema')
const team = require('./teamSchema')
const updateSchema = require('./updateSchema')
const getPlayerSchema = require('./getPlayerSchema')
const player = require('./playerSchema')
const updatePlayerSchema = require('./updatePlayerSchema')
const deletePlayerSchema = require('./deletePlayerSchema')
const deleteTeamSchema = require('./deleteTeamSchema')
const matchSchedule = require('./matchSchema')

module.exports = {
    getSchema,
    loginSchema,
    team,
    updateSchema,
    deleteTeamSchema,
    getPlayerSchema,
    player,
    updatePlayerSchema,
    deletePlayerSchema,
    matchSchedule
}