const express = require('express')
const passport = require('passport')
const router = express.Router()
const roomCtrl = require('../controller/room.controller')

router.post("/createroom",
    passport.authenticate('jwt', {session : false}),
    roomCtrl.createRoom
)

router.post("/joinroom",
    passport.authenticate('jwt', {session : false}),
    roomCtrl.joinRoom
)

router.post("/leaveroom",
    passport.authenticate('jwt', {session : false}),
    roomCtrl.leaveRoom
)

module.exports = router 