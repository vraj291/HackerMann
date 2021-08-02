const Room = require('../models/Room')

const createRoom = async (req,res) => {
    try{
        const temp_room = new Room({
            room_name : req.query.room_name,
        })
        temp_room.setId()
        temp_room.addUser(req.query.user)
        await temp_room.save()
        return res.status(200).json({
            room : {
                room_name : temp_room.room_name,
                room_id : temp_room.room_id,
                users : temp_room.users
            },
            message: 'Room created successfully.'
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            error: 'Could not create room.'
        })
    }
}

const joinRoom = async (req,res) => {
    try{
        Room.findOne({room_id : req.query.code})
        .then(async (room) => {
            if(room){
                await Room.updateOne(
                    { room_id :  req.query.code},
                    { $set: { users: [...room.users,req.query.user] } }
                );
                return res.status(200).json({
                    room : {
                        room_name : room.room_name,
                        room_id : room.room_id,
                        users : [...room.users,req.query.user]
                    },
                    message: 'Room joined successfully.'
                })
            }else{
                return res.status(400).json({
                    error: 'Room doesnt exist.'
                })
            }
        })
    }
    catch(err){
        return res.status(400).json({
            error: 'Could not join room.'
        })
    }
}

const leaveRoom = async (req,res) => {
    try{
        Room.findOne({room_id : req.query.code})
        .then(async (room) => {
            if(room){
                if(room.users.length === 1){
                    await room.deleteOne()
                }else{
                    await Room.updateOne(
                        { room_id :  req.query.code},
                        { $set: { users: [...room.users.filter( e => e !== req.query.user)] } }
                    );
                }
                return res.status(200).json({
                    message: 'Room left successfully.'
                })
            }else{
                return res.status(400).json({
                   error: 'Room doesnt exist.'
                })
            }
        })
    }
    catch(err){
        return res.status(400).json({
            error: 'Could not leave room.'
        })
    }
}

module.exports = {createRoom,joinRoom,leaveRoom}