import React,{useEffect,useState} from 'react'
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './CustomInput.css'

export const CustomInput = (props) => {

    const [checked,setChecked] = useState(false)
    let content = ''

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            padding : '0.3rem'
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
                className='label'
                control={
                <Switch
                    color='secondary'
                    checked={checked}
                    onChange={toggle}
                />}
                label="Custom Input"
                labelPlacement="start"
            />
            {content}
        </div>
)}