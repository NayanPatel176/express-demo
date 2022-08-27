const express = require('express')
const dotenv = require('dotenv')
dotenv.config('./.env')

// mongodb connection
var { main, db } = require('./mongoDB')

const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
var options = {
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json'
    }
  }
app.use(express.json())

const { teamRoutes, playerRoutes, matchScheduleRoutes } = require('./routes')

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/team', teamRoutes)
app.use('/player', playerRoutes)
app.use('/match', matchScheduleRoutes)

app.get('/hello', (req, res) => {
    res.status(200).json({ message: "Hello world", status : 200 })
})

app.listen(process.env.PORT, async () => { 
  console.log("App listen on", process.env.PORT)
  await main()
})