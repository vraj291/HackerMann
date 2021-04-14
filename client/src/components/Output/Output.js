import React, { useEffect,useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {errors} from '../errors'
import InputBase from '@material-ui/core/InputBase';
import './Output.css'
import { Typography } from '@material-ui/core';

export const Output = (props) => {

    const [output,setOutput] = useState('')
    const [status,setStatus] = useState('Press Green to Execute')
    const [time,setTime] = useState('-')
    const [memory,setMemory] = useState('-')

    useEffect(() => {
        console.log(props.response)
        if(props.response == ''){
            setOutput('')
            setStatus('Press Green to Execute')
            setTime('-')
            setMemory('-')
        }else if (props.response == true){
            setOutput('Compiling...')
            setStatus(' ')
            setTime('')
            setMemory('')
        }else{
            if(props.response.req_status === 'REQUEST_QUEUED'){
                setStatus('The API request has been queued.')
                props.handleQueue(props.response.he_id)
            }else{
                if(props.response.compile_status !== 'OK'){
                    setStatus('Compilation Error')
                    setOutput(props.response.compile_status)
                    setTime('-')
                    setMemory('-')
                }else{
                    if(props.response.status == 'AC'){
                        setStatus(errors[props.response.status])
                        let test_resp = props.response.output.replaceAll('↵','\n')
                        setOutput(test_resp)
                        setTime(`${parseFloat(props.response.time_used).toFixed(3)}s`)
                        setMemory(`${parseFloat(props.response.memory_used/1024).toFixed(3)}kb`)
                    }else if(props.response.status == 'MLE' || props.response.status == 'TLE'){
                        setStatus(errors[props.response.status])
                        setOutput('')
                        setTime('-')
                        setMemory('-')
                    }else{
                        setStatus(errors[props.response.status_detail])
                        setOutput(props.response.stderr)
                        setTime('-')
                        setMemory('-')
                    }
                }
            }
        }
    },[props.response])
    
    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            padding : '0.3rem 0.5rem'
        }
    });

    const classes = useStyles();

    return(
        <div className='out-wrapper'>
            <Typography>{status}</Typography>
            <div className='output'>
                <InputBase 
                    inputProps = {{className : classes.root}}
                    className = 'output-lines'
                    multiline
                    rowsMax = {5}
                    value = {output}
                    readOnly
                />
            </div>
            <div className='exec-info'>
                <Typography>Time used : {time}</Typography>
                <Typography>Memory used : {memory}</Typography>
            </div>
        </div>
)}