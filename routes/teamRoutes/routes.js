const express = require('express')
const router = express.Router()
const schema = require('../../schema')
const auth = require('../../auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { get } = require('../../mongoDB')
const ObjectId = require('mongodb').ObjectId
const collectionName = 'team';

router.post('/login', schema.loginSchema, async (req, res) => {
    try {
        const token = jwt.sign({ userName: req.body.userName }, process.env.SECRET_KEY)
        const data = jwt.verify(token, process.env.SECRET_KEY) 
        console.log('req.body.password: ', req.body.password);
        const size = 10
        const salt = await bcrypt.genSalt(size)
        console.log('salt: ', salt);
        const bcrptPass = await bcrypt.hash(req.body.password, salt)
        console.log('bcrptPass: ', bcrptPass);
        // const bcrptPass = "$2b$10$IUKc5UT9uA98BJdQdbLTheugYUu13S8Rkzlh6ItizYPD/o/cMApR6"
        const password = await bcrypt.compare(req.body.password ,bcrptPass)
        console.log('password: ', password);
        console.log('data: ', data);

        res.status(200).json({ message: 'Successfully loggedin!!!', status: 200, data: { token } })
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ status: 500, message: 'Something went wrong' })        
    }
})

router.get('/getTeam', auth.basicAuth, schema.getSchema, async (req, res) => {
    let aggregate = [] 
    if(req.query.teamName){
        aggregate.push({ $match: { teamName : req.query.teamName } })
    } 
    if(req.query.country){
        aggregate.push({ $match: { country : req.query.country } })
    } 
    if(req.query.type){
        aggregate.push({ $match: { type : req.query.type } })
    }
    aggregate.push(
        { 
            $lookup: { from: 'player', localField: '_id', foreignField : 'teamId', as: 'players' } 
        },
        {
            $project: { _id: 0, 'players._id': 0 } 
        },
        {
            $unwind: "$players"
        }
    ) 
    const teamData = await get().collection(collectionName).aggregate(aggregate).toArray()
    res.status(200).json({ data: teamData , message: "Successfully data retrive" , status: 200 })
})

router.post('/createTeam', auth.basicAuth, schema.team, async (req, res) => {
    try {
        const cheackTeamName = await get().collection(collectionName).findOne({ teamName: req.body.teamName })
        if(cheackTeamName) return res.status(400).send({ status: 400, message: "Team Name already exist. Please use different name"})
        await get().collection(collectionName).insertOne(req.body)
        res.send({ status: 200, message: "Team created successfully created!!!"})
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
})

router.patch('/updateTeam', auth.basicAuth, schema.updateSchema, async (req, res) => {
    let teamId = ObjectId(req.body.teamId) 
    let body = {}
    if(req.body.teamName){
        body.teamName = req.body.teamName
    } 
    if(req.body.country){
        body.country = req.body.country
    } 
    if(req.body.type){
        body.type = req.body.type
    } 
    const cheackTeamName = await get().collection(collectionName).findOne({ teamName: req.body.teamName, _id: { $nin: [teamId]} })
    if(cheackTeamName) return res.status(400).send({ status: 400, message: "Team Name already exist. Please use different name"})
    const teamData = await get().collection(collectionName).findOneAndUpdate({ _id: teamId}, { $set: body })
    res.status(200).json({ data: { teamData }, message: "Successfully data retrive" , status: 200 })
})

router.delete('/deleteTeam/:id', auth.basicAuth, schema.deleteTeamSchema, async (req, res) => {
    try {
        let id = req.params.id
        let _id = new ObjectId(id)
        const cheackTeamName = await get().collection(collectionName).findOne({ _id })
        if(!cheackTeamName) return res.status(400).send({ status: 400, message: "Team doesn't exist"})
        await get().collection(collectionName).findOneAndDelete({ _id })
        res.send({ status: 200, message: "Team deleted successfully!!!" })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
})


module.exports = router
