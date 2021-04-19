const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require("socket.io")
const app = express()
const execute_router = require('./routes/execute')
const create_room = require('./routes/room')

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = socketIo(server,{
    cors: {
        origin: "*"
    }
})

app.use('/api/',execute_router)
app.use('/api/',(req,res,next) => {
    req.io = io
    next()
},create_room)

const port = process.env.PORT || 8080

server.listen(port,console.log(`Server Running on port ${port}`))