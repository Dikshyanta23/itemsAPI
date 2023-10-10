const express = require('express')
require('dotenv').config()
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
require('express-async-errors')
const authRouter = require('./routes/auth')
const itemRouter = require('./routes/items')
const connectDB = require('./connect/connect')
const authMiddleware = require('./middleware/auth')


//extra security package
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

//middleware
app.use(express.json())
//security packages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
  })
);
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res)=> {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//routes
//auth routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/items', authMiddleware,itemRouter)

//custom middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)




const port = process.env.PORT || 3001

const start = async () => {
    try {
      //connect DB
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () => console.log(`Server up on port ${port}`));
    } catch (error) {
        console.log(error);
    }


}

start()

