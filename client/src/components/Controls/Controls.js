import React from 'react'
import {languages} from '../languages'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import {GetApp} from '@material-ui/icons'
import {Button} from '../Button/Button'
import './Controls.css'
import { IconButton } from '@material-ui/core';

export const Controls = (props) => {

    const useStyles = makeStyles({
        root: {
            color : '#FAFAFA'
        },
        typo: {
            color : '#FAFAFA',
            fontSize : 'large',
            fontFamily : "'Saira Condensed', sans-serif"
        }
    });

    const classes = useStyles();

    return(
        <div className='controls'>
            <div className='input-buttons'>
                <Button 
                    color='red'
                    text='Leave Room'
                    onClick = {async() => await props.handleLeaveRoom()}
                />
                <Button 
                    color='yellow'
                    text='Clear Code'
                    onClick = {props.handleClear}
                />
                <Button 
                    color = 'rgb(26, 221, 19)'
                    text = 'Execute Code'
                    onClick = {props.handleExecute}
                />
            </div>
            <div className='input-labels'>
                <IconButton>
                    <a 
                        href = {'data:text/plain;charset=utf-8,' + encodeURIComponent(props.code)}
                        download = 'hackermann.txt'
                    >
                        <GetApp color='secondary'/>
                    </a>
                </IconButton>
                <TextField
                    InputProps={{className : classes.typo}}
                    InputLabelProps={{className : classes.typo}}
                    select
                    label="Language"
                    variant = 'outlined'
                    value={props.lang}
                    onChange={e => props.handleLang(e.target.value)}
                >
                    {Object.keys(languages).map((e) => (
                        <MenuItem key={e} value={e}>
                            {e}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </div>
)}