import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './CustomInput.css'
import { Typography } from '@material-ui/core';

export const CustomInput = (props) => {

    const [checked,setChecked] = useState(false)
    let content = ''

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            padding : '0.3rem'
        },
        typo: {
            fontSize : 'large',
            fontFamily : "'Saira Condensed', sans-serif"
        }
    });

    const classes = useStyles();
    
    const toggle = () => {
        if(checked) {
            setChecked(false)
        }else{
            setChecked(true)
        }
    }

    if(checked){
    content = <InputBase 
                className = 'input'
                inputProps = {{className : classes.root}}
                multiline
                rows = {5}
                value = {props.input}
                onChange = {(e) => props.handleInput(e.target.value)}
            />
    }

    return(
        <div className='custom-input'>
            <FormControlLabel
                className="label"
                control={
                <Switch
                    color='secondary'
                    checked={checked}
                    onChange={toggle}
                />}
                label={<Typography className={classes.typo}>Custom Input</Typography>}
                labelPlacement="start"
            />
            {content}
        </div>
)}