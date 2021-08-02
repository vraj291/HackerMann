const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const TokenSchema = new mongoose.Schema({
    user : {
        type : String,
        required  : true
    },
    token : {
        type: String,
        required: true,
    },
    created_at : {
        type: Date,
        default: Date.now(),
        expires: 3600,
    }
})

TokenSchema.methods = {
    authenticate : function(pass){
        return bcrypt.compareSync(pass, this.token)
    }
}

module.exports = mongoose.model('Token',TokenSchema)