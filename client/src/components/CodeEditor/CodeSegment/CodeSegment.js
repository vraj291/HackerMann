import React from 'react'
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import './CodeSegment.css'

export const CodeSegment= (props) => {

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            padding : '0.3rem'
        }
    });

    const classes = useStyles();

    return(
        <InputBase 
            className = 'code-segment'
            inputProps = {{className : classes.root}}
            multiline
            rows = {18}
            value = {props.code}
            onChange = {(e) => props.handleCode(e.target.value)}
        />
)}