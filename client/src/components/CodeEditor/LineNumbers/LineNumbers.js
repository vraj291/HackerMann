import React, {useEffect,useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import './LineNumbers.css'

export const LineNumbers = (props) => {

    const [content,setContent] = useState('\n')

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            textAlign : 'right',
            padding : '0.3rem',
            overflowY : 'hidden'
        }
    });

    const classes = useStyles();

    useEffect(() => {
        let arr = props.code.split('\n')
        let temp = ''
        for(let i = 1 ; i < arr.length;i++){
            temp += `${i}\n`
        }
       temp += `${arr.length}`
       setContent(temp)
    },[props.code])

    return(
        <InputBase 
            inputProps = {{className : classes.root}}
            className = 'lines'
            multiline
            rows = {18}
            value = {content}
            readOnly
        />
)}