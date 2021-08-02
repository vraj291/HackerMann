import axios from 'axios'
import {getJWT} from '../auth/auth_helpers'

export const createRoom = (data) => {
    let jwtToken = getJWT()
    return axios({
        method : 'POST',
        url : `${process.env.REACT_APP_BACKEND_URI}/createroom`,
        params : data, 
        headers : {
            'Authorization' : `Bearer ${jwtToken}`
        }
    })
    .then(rs => ({err : false,data : rs.data.room}))
    .catch(err =>({err : true,data : err.response.data.error}))
}

export const joinRoom = (data) => {
    let jwtToken = getJWT()
    return axios({
        method : 'POST',
        url : `${process.env.REACT_APP_BACKEND_URI}/joinroom`,
        params : data, 
        headers : {
            'Authorization' : `Bearer ${jwtToken}`
        }
    })
    .then(rs => ({err : false,data : rs.data.room}))
    .catch(err =>({err : true,data : err.response.data.error}))
}

export const leaveRoom = (data) => {
    let jwtToken = getJWT()
    return axios({
        method : 'POST',
        url : `${process.env.REACT_APP_BACKEND_URI}/leaveroom`,
        params : data, 
        headers : {
            'Authorization' : `Bearer ${jwtToken}`
        }
    })
    .then(rs => ({err : false,msg : rs.data.message}))
    .catch(err =>({err : true,msg : err.response.data.error}))
}