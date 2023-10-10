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

const app = express()

//middleware
app.use(express.json())

app.get('/', (req, res)=> {
    res.send('This is going to be fun')
})

//routes
//auth routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/items', authMiddleware,itemRouter)

//custom middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

//security packages
app.set('trust proxy', 1);
app.use(
  rateLimit({
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

