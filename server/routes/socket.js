const addIoUtilities = (io,room) => {

    io.on("connection" , (socket) => {

        socket.join(room)

        socket.on("makeChanges_code", (new_code) => {
            io.to(room).emit("getChanges_code", new_code)
        })

        socket.on("makeChanges_lang" , (new_lang) => {
            io.to(room).emit("getChanges_lang",new_lang)
        })

        socket.on("makeChanges_output" , (new_out) => {
            io.to(room).emit("getChanges_output",new_out)
        })

        socket.on("isTyping" , (user) => {
            io.to(room).emit("getTyping",user)
        })

        socket.on("addUser", (details) => {
            io.to(room).emit("updateUsers", details)
        })

        socket.on("addMessage", (msg) => {
            io.to(room).emit("updateMessages", msg)
        })

    })

    return io
    
}

module.exports = {addIoUtilities}