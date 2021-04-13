import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import './Output.css'
import { Typography } from '@material-ui/core';

export const Output = (props) => {

    const [output,setOutput] = useState('Compiling...')
    const [status,setStatus] = useState('Press Green to Execute')
    const [time,setTime] = useState('-')
    const [memory,setMemory] = useState('-')

    
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
                    className = 'lines'
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