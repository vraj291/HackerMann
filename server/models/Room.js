const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    room_name : {
        type : String,
        trim : true,
        required : 'Room name is required.'
    },
    room_id : {
        type : String,
        required : true,
        unique : 'Room already exists.',
    },
    users : {
        type : []
    }
})

RoomSchema.methods = {
    setId : function(){
        var result           = [];
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < 4; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        this.room_id = result.join('');
    },
    addUser : function(user){
        if(this.users.length === 0){
            this.users = [user]
        }else{
            this.users = [...this.users,user]
        }
    },
    deleteUser : function(user){
        if(this.users.length > 1){
            this.users = [...this.users.filter( e => e !== user)]
        }else{
            throw 'Invalid Operation'
        }
    }
}

module.exports = mongoose.model('Room',RoomSchema)