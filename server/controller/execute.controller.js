const fetch= require('node-fetch')

const he_url = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
const client_id = process.env.HACKERRANK_CLIENT_ID
const callback = 'https://client.com/callback/'
const key = process.env.HACKERRANK_CLIENT_KEY
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
                                            console.log(result)
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

const executeCode = async (req,res) => {
    try{
        let data = JSON.stringify({    
            'source': req.query.source,
            'lang': req.query.lang,
            'time_limit': 5,
            'memory_limit': 246323,
            'input': req.query.input || "",
            'callback' : callback
        })
        let he_id = req.query.he_id || undefined
        console.log(data)
        results = await getResults(data,he_id)
        return res.status(200).json(results)
    }catch(err){
        return res.status(400).json({
            error : 'Could not execute code.'
        })
    }
}

module.exports = {executeCode}