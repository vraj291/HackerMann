import axios from 'axios'
import { setJWT } from './auth_helpers'

export const registerUser = (data) => {
    console.log(data)
    return axios({
        method : 'post',
        url : `${process.env.REACT_APP_BACKEND_URI}/register`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params : data
    }).then(resp => ({err : false,msg : resp.data.message}))
    .catch(err => ({err : true,msg : err.response.data.error}))
}

export const loginUser = (data) => {
    return axios({
        method : 'post',
        url : `${process.env.REACT_APP_BACKEND_URI}/login`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params : data
    }).then(resp => {
        if(resp.data.auth){
            setJWT(resp.data.token)
        }
        return {err : false,msg : resp.data.message}
    })
    .catch(err => ({err : true,msg : err.response.data.error}))
}

export const changePassword = (data) => {
    return axios({
        method : 'post',
        url : `${process.env.REACT_APP_BACKEND_URI}/requestPasswordChange`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params : data
    }).then(resp => ({err : false,msg : resp.data.message}))
    .catch(err => ({err : true,msg : err.response.data.error}))
}

export const updatePassword = (data) => {
    return axios({
        method : 'post',
        url : `${process.env.REACT_APP_BACKEND_URI}/resetPassword`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        params : data
    }).then(resp => ({err : false,msg : resp.data.message}))
    .catch(err => ({err : true,msg : err.response.data.error}))
}
