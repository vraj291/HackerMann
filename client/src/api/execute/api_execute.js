import axios from 'axios'
import {getJWT} from '../auth/auth_helpers'

export const executeCode = (data) => {
    let jwtToken = getJWT()
    return axios({
        method : 'POST',
        url : `${process.env.REACT_APP_BACKEND_URI}/execute`,
        params : data, 
        headers : {
            'Authorization' : `Bearer ${jwtToken}`
        }
    })
    .then(rs => ({err : false,data : rs.data}))
    .catch(err =>({err : true,data : err.response.data.error}))
}