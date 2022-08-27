const express = require('express')
const router = express.Router()
const schema = require('../../schema')
const auth = require('../../auth')
const jwt = require('jsonwebtoken')
const { get } = require('../../mongoDB')
const ObjectId = require('mongodb').ObjectId
const collectionName = 'player';

router.get('/getPlayer', auth.basicAuth, schema.getPlayerSchema, async (req, res) => {
    let aggregate = [] 
    if(req.query.playerName){
        var Value_match = new RegExp(req.query.playerName);
        aggregate.push(
            { $addFields: { result: { $regexMatch: { input: "$playerName", regex: Value_match, options: 'i' } } } },
            { $match: { result: true } }, 
            { $project: { 'result': 0 } }
            )
    } 
    if(req.query.role){
        aggregate.push({ $match: { role : req.query.role } })
    } 
    if(req.query.age){
        aggregate.push({ $match: { age : req.query.age } })
    } 
    if(req.query.score){
        aggregate.push({ $match: { score : req.query.score } })
    } 
    if(req.query.wicket){
        aggregate.push({ $match: { wicket : req.query.wicket } })
    }
    if(req.query.teamId){
        aggregate.push(
            { $match: { teamId: new ObjectId(req.query.teamId) } },
            { $lookup: { from: 'team', localField: 'teamId', foreignField : '_id', as: 'team' } },
            { $unwind: '$team' },
            { $project: { 'team._id': 0 } },
            )
    }
    const playerData = await get().collection(collectionName).aggregate(aggregate).toArray()
    res.status(200).json({ data: playerData , message: "Successfully data retrive" , status: 200 })
})

router.post('/createPlayer', auth.basicAuth, schema.player, async (req, res) => {
    try {
        let data = req.body;
        data.teamId = req.body.teamId ? new ObjectId(req.body.teamId) : 0;
        data.score = req.body.score ? req.body.score : 0;
        data.wicket = req.body.wicket ? req.body.wicket : 0;
        // const cheackPlayerName = await get().collection(collectionName).findOne({ playerName: req.body.playerName })
        // if(cheackPlayerName) return res.status(400).send({ status: 400, message: "Player Name already exist. Please use different name"})
        await get().collection(collectionName).insertOne(req.body)
        res.send({ status: 200, message: "Player created successfully created!!!"})
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
})

router.patch('/updatePlayer', auth.basicAuth, schema.updatePlayerSchema, async (req, res) => {
    let playerId = ObjectId(req.body.playerId) 
    let body = {}
    let inc = {}
    if(req.body.playerName){
        body.playerName = req.body.playerName
    }
    if(req.body.role){
        body.role = req.body.role
    }
    if(req.body.age){
        body.age = req.body.age
    }
    if(req.body.score){
        inc.score = req.body.score
    }
    if(req.body.wicket){
        inc.wicket = req.body.wicket
    }
    const cheackPlayer = await get().collection(collectionName).findOne({ _id: playerId })
    console.log('cheackPlayer: ', !cheackPlayer);
    if(!cheackPlayer) return res.status(404).send({ status: 404, message: "Player not found"})
    const playerData = await get().collection(collectionName).findOneAndUpdate({ _id: playerId}, { $set: body, $inc: inc })
    console.log('body: ', playerData);
    res.status(200).json({ data: { playerData }, message: "Player updated successfully" , status: 200 })
})

router.delete('/deletePlayer/:id', auth.basicAuth, schema.deletePlayerSchema, async (req, res) => {
    try {
        let id = req.params.id
        let _id = new ObjectId(id)
        await get().collection(collectionName).findOneAndDelete({ _id })
        res.send({ status: 200, message: "Player deleted successfully!!!" })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
})


module.exports = router
