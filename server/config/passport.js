const jwtSecret = require('./jwtConfig')

const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/User')

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : jwtSecret.secret
}

passport.use(
    'jwt',
    new JWTStrategy(jwtOptions,(jwt_payload,done) => {
        try{
            User.findOne({user : jwt_payload.id})
            .then(user => {
                if(user){
                    done(null,user)
                }else{
                    done(null,false)
                }
            })
        }
        catch(err){
            done(err)
        }
    })
)




