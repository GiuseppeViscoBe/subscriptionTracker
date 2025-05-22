import express from 'express'
import {ENV } from './config/env'

import userRouter from './routes/user.routes'
import subscriptionRouter from './routes/subscription.routes'
import authRouter from './routes/auth.routes'

import connectToDb from './database/mongodb'
import errorHandler from './middlewares/error.middleware'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : false}))
//app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscription', subscriptionRouter)


app.use(errorHandler)


app.get('/', (req,res) => {
    res.send('Hello World!')
})


app.listen(ENV.PORT, async () => {
    console.log('Server listening on port: ' + ENV.PORT)
    console.log(ENV.NODE_ENV)
    await connectToDb()
})

