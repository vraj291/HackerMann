const socketIo = require("socket.io")
const http = require('http')

const addIoUtilities = (app) => {

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

        socket.on("makeChanges_output" , ({new_out,room_id}) => {
            socket.broadcast.to(room_id).emit("getChanges_output",new_out)
        })

        socket.on("isTyping" , ({user,room_id}) => {
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
            console.log('Left Room')
        })
    })

    return io
    
}

module.exports = {addIoUtilities}