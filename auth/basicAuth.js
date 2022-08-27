const basicAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization ? 
            (req.headers.authorization).split(" ")[1] : 
            res.status(400).json({ status: 400, message: "Token is missing or invalid!!!" })
        if(token === process.env.BASIC_AUTH) return next()
        res.status(401).json({ status: 401, message: "Unauthorized" })
    } catch (error) {
        res.status(500).json({ status: 500, message: "Something went wrong" })
    }
    
}

module.exports = basicAuth