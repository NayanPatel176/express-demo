const jwt = require('jsonwebtoken')
const userAuth = (req, res, next) => {
    try {
        const barerToken = req.headers.authorization
        if(!barerToken) return res.status(400).json({ message: 'Token missing or invalid' })
        const token = barerToken.split(' ')[1]
        if(!token) return res.status(400).json({ message: 'Token missing or invalid' })
        const value = jwt.verify(token, process.env.SECRET_KEY)
        // console.log('error: ', error);
        console.log('value: ', value);
        next()
    } catch (error) {
        res.status(500).json({ status: 500, error })        
    }
}

module.exports = userAuth