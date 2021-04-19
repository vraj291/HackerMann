const express = require('express')
const {addNewUser,deleteUser} = require('../db')

const router = express.Router()

router.post("/createroom",async (req,res) => {

    let user_name = req.body.user_name
    let room_name = req.body.room_name

    let details = await addNewUser({user_name,room_name},req.io)

    res.send(details)
    
})

router.post("/leaveroom",async (req,res) => {

    let user_name = req.body.user_name
    let room_name = req.body.room_name

    let details = await deleteUser({user_name,room_name})

    if (details != {})
        req.io.to(room_name).emit('updateUsers',details)

})

module.exports = router 