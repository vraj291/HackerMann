const User = require('../models/User')
const getError = require('../utils/dbErrorHandler')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/jwtConfig')
const Token = require('../models/Token')
const {urlGoogle,getGoogleEmailFromCode} = require('../utils/googleClient')
const {sendWelcomeEmail,sendRequestPasswordEmail,sendResetPasswordEmail} = require('../utils/sendEmail')
const { createPasswordToken } = require('../utils/createTokens')
const { getGithubEmailfromCode } = require('../utils/githubClient')

const clientURL = process.env.FRONTEND_URI

const registerUser = async (req,res) => {
    const temp_user = new User(req.query)
    try{
        await temp_user.save()
        sendWelcomeEmail({
            user : req.query.user,
            email : req.query.email
        })
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    }
    catch(err){
        return res.status(400).json({
            error: getError(err)
        })
    }
}

const loginUser = async (req,res) => {
    try{
        User.findOne({user : req.query.user})
        .then(user => {
            if(user){
                if(!user.authenticate(req.query.password)){
                    res.status(400).json({
                        error : "Password does not match"
                     })
                }else{
                    const token = jwt.sign({id : user.user},jwtSecret.secret)
                    return res.status(200).json({
                        auth : true,
                        token : token,
                        message: "Successfully logged in!"
                    })
                }
            }else{
                res.status(400).json({
                   error : "User Doesn't Exist"
                })
            }
        })
    }
    catch(err){
        return res.status(400).json({
            error : "Could not Login"
        })
    }
}

const requestPasswordChange = async (req,res) => {
    try{
        User.findOne({user : req.query.user})
        .then(user => {
            if(user){
                Token.findOne({user : user.user})
                .then(async (token) => {
                    if(token){
                        await token.deleteOne()
                    }
                    const token_value = createPasswordToken()
                    const temp_token = new Token({
                        user : user.user,
                        token : token_value.hash
                    })
                    await temp_token.save()
                    let link = `${clientURL}/#/passwordReset/${user.user}/${token_value.token}`
                    if (sendRequestPasswordEmail({
                        user : user.user,
                        email : user.email
                    },link)){
                        res.status(400).json({
                            error : "Email not sent"
                        })
                    }else{
                        res.status(200).json({
                            message : `Email sent to ${user.email}`
                        })
                    }
                })
            }else{
                res.status(400).json({
                   error : "User Doesn't Exist"
                })
            }
        })
    }
    catch(err){
        return res.status(400).json({
            error : "Could not reset password"
        })
    }
}

const resetPassword = async (req,res) => {
   try{
        Token.findOne({user : req.query.user})
        .then( async (token) => {
            if(token){
                if(!token.authenticate(req.query.token)){
                    return res.status(400).json({
                        error : "Invalid Token"
                    })
                }else{
                    await User.updateOne(
                        { user :  req.query.user},
                        { $set: { password: req.query.password } },
                        { new: true }
                    );
                    User.findOne({user : req.query.user}).then(user => {
                        sendResetPasswordEmail({
                            user : user.user,
                            email : user.email
                        })
                    })
                    await token.deleteOne()
                    return res.status(200).json({
                        message : "Password Successfully Reset"
                    })
                }
            }else{
                return res.status(400).json({
                    error : "Expired Token"
                })
            }
        })
   }
   catch(err){
        return res.status(400).json({
            error : "Could not reset password"
        })
   }
}

const googleSigninUrl = async (req,res) => {
    res.redirect(urlGoogle())
}

const googleSigninVerify = async (req,res) => {
    try{
        let email = await getGoogleEmailFromCode(req.query.code)
        User.findOne({email : email})
        .then(user => {
            if(user){
                const token = jwt.sign({id : user.user},jwtSecret.secret)
                let url = `${process.env.FRONTEND_URI}/#/?token=${encodeURIComponent(token)}&user=${encodeURIComponent(user.user)}`
                return  res.redirect(url)
            }else{
                let url = `${process.env.FRONTEND_URI}/#/?error=${encodeURIComponent('User doesnt exist')}`
                return  res.redirect(url)
            }
        })
    }
    catch(err){
        let url = `${process.env.FRONTEND_URI}/#/?error=${encodeURIComponent('Could not login')}`
        return  res.redirect(url)
    }
}

const githubSigninUrl = async(req,res) => {
    let url = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URL}`
    res.redirect(url)
}

const githubSigninVerify = async (req,res) => {
    try{
        let email = await getGithubEmailfromCode(req.query.code)
        User.findOne({email : email})
        .then(user => {
            if(user){
                const token = jwt.sign({id : user.user},jwtSecret.secret)
                let url = `${process.env.FRONTEND_URI}/#/?token=${encodeURIComponent(token)}&user=${encodeURIComponent(user.user)}`
                return  res.redirect(url)
            }else{
                let url = `${process.env.FRONTEND_URI}/#/?error=${encodeURIComponent('User doesnt exist')}`
                return  res.redirect(url)
            }
        })
    }
    catch(err){
        let url = `${process.env.FRONTEND_URI}/#/?error=${encodeURIComponent('Could not login')}`
        return  res.redirect(url)
    }
}

module.exports = {githubSigninVerify,githubSigninUrl,googleSigninVerify,googleSigninUrl,registerUser,loginUser,requestPasswordChange,resetPassword}
