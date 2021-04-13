const express = require('express')
const cors = require('cors')
const app = express()
const fetch= require('node-fetch')

const he_url = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
const client_id = '3da76c47d7994800f7680ad9401d0340b222a002b76b.api.hackerearth.com'
const callback = 'https://client.com/callback/'
const key = '53ca6948aaed625b6c0c659707c3a0a6d21c350a'
const headers = {'Content-Type': 'application/json',"client-secret": key}

const getResults = async (data,he_id) => {
    if(he_id === undefined){
    return await fetch(he_url,{method:'post', body : data, headers : headers })
    .then(rs => rs.text())
    .then(body => {
        return (JSON.parse(body)).he_id
    })
    .then(async he_id => await fetch(`${he_url}${he_id}/`,{method:'get', headers : headers })
                    .then(rs => rs.text())
                    .then(body => {
                        return (JSON.parse(body)).he_id
                    })
                    .then(async he_id => await fetch(`${he_url}${he_id}/`,{method:'get', headers : headers })
                                    .then(rs => rs.text())
                                    .then(body => {
                                        return (JSON.parse(body))
                                    })
                                    .then(async result => {
                                            return({
                                                he_id : result.he_id,
                                                req_status : result.request_status.code,
                                                compile_status: result.result.compile_status,
                                                status : result.result.run_status.status,
                                                status_detail : result.result.run_status.status_detail,
                                                stderr : result.result.run_status.stderr || undefined ,
                                                time_used : result.result.run_status.time_used,
                                                memory_used : result.result.run_status.memory_used,
                                                output : result.result.run_status.output? await fetch(result.result.run_status.output,{method:'get'})
                                                           .then(rs => rs.text())
                                                        : ""   
                                            })
                                        })))
    .catch(err => console.log(err))
    }else{
    return await fetch(`${he_url}${he_id}/`,{method:'get', headers : headers })
                    .then(rs => rs.text())
                    .then(body => {
                        return (JSON.parse(body)).he_id
                    })
                    .then(async he_id => await fetch(`${he_url}${he_id}/`,{method:'get', headers : headers })
                                    .then(rs => rs.text())
                                    .then(body => {
                                        return (JSON.parse(body))
                                    })
                                    .then(async result => {
                                            return({
                                                he_id : result.he_id,
                                                req_status : result.request_status.code,
                                                compile_status: result.result.compile_status,
                                                status : result.result.run_status.status,
                                                status_detail : result.result.run_status.status_detail,
                                                stderr : result.result.run_status.stderr || undefined ,
                                                time_used : result.result.run_status.time_used,
                                                memory_used : result.result.run_status.memory_used,
                                                output : result.result.run_status.output? await fetch(result.result.run_status.output,{method:'get'})
                                                           .then(rs => rs.text())
                                                        : ""   
                                            })
                                        }))
    }
}

app.use(cors())
app.use(express.json())

app.post("/execute",async (req,res) => {
    let data = JSON.stringify({    
        'source': req.body.source,
        'lang': req.body.lang,
        'time_limit': 5,
        'memory_limit': 246323,
        'input': req.body.input || "",
        'callback' : callback
    })
    let he_id = req.body.he_id || undefined
    results = await getResults(data,he_id)
    res.send(results)
})

const port = process.env.PORT || 8080
app.listen(port,console.log(`Server Running on port ${port}`))