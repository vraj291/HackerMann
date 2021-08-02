const express = require('express')
const cors = require('cors')
require('dotenv').config()
const socketIo = require("socket.io")
const http = require('http')
const passport = require('passport')
const mongoose = require('mongoose')
const app = express()
const auth_router = require('./routes/auth')
const execute_router = require('./routes/execute')
const create_room = require('./routes/room')

require('./config/passport')

app.use(cors())
app.use(express.json())

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const server = http.createServer(app)
const io = socketIo(server,{
    cors: {
        origin: "*"
    }
})

io.on("connection" , (socket) => {

    socket.on('joinRoom',(room_id) => {
        socket.join(room_id)
    })

    socket.on("makeChanges_code", ({new_code,room_id}) => {
        socket.to(room_id).emit("getChanges_code", new_code)
    })

    socket.on("makeChanges_lang" , ({new_lang,room_id}) => {
        socket.broadcast.to(room_id).emit("getChanges_lang",new_lang)
    })

    socket.on("makeChanges_input" , ({new_inp,room_id}) => {
        socket.broadcast.to(room_id).emit("getChanges_input",new_inp)
    })

    socket.on("makeChanges_output" , ({new_out,room_id}) => {
        socket.broadcast.to(room_id).emit("getChanges_output",new_out)
    })

    socket.on("isTyping" , ({user,room_id}) => {
        console.log(user)
        socket.broadcast.to(room_id).emit("getTyping",user)
    })

    socket.on("addUser", ({user,room_id}) => {
        socket.to(room_id).emit("updateUsers", {op : 0,user : user})
    })

    socket.on("deleteUser", ({user,room_id}) => {
        socket.to(room_id).emit("updateUsers", {op : 1,user : user})
    })

    socket.on("addMessage", ({msg,room_id}) => {
        socket.to(room_id).emit("updateMessages", msg)
    })

    socket.on('leaveRoom',(room_id) => {
        socket.leave(room_id)
    })
})

app.use(passport.initialize())

app.get('/', function(req, res, next) {
    res.send("Hello world");
});

app.use('/api/',execute_router)
app.use('/api/',create_room)
app.use('/api/',auth_router)

const port = process.env.PORT || 8080

server.listen(port,console.log(`Server Running on port ${port}`))