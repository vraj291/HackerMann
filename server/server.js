const express = require('express')
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const app = express()
const execute_router = require('./routes/execute')
const socket_router = require('./routes/socket')

app.use(cors())
app.use(express.json())

app.use('/api/',execute_router)

const server = http.createServer(app)
const io = socketIo(server,{
    cors: {
      origin: "*"
    }
})

io.on("connection" , (socket) => {
    socket.on("makeChanges", (new_code) => {
        io.emit("getChanges", new_code)
    })
})

const port = process.env.PORT || 8080
server.listen(port,console.log(`Server Running on port ${port}`))