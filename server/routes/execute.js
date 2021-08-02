const express = require('express')
const passport = require('passport')
const execCtrl = require('../controller/execute.controller')
const router = express.Router()

router.post("/execute",
    passport.authenticate('jwt', {session : false}),
    execCtrl.executeCode
)

module.exports = router

