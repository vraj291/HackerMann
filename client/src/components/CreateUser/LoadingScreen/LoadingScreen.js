import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import './LoadingScreen.css'

export const LoadingScreen = ({text}) => {

    const useStyles = makeStyles({
        root: {
            fontFamily : "'Titillium Web', sans-serif",
            color : 'rgb(37, 163, 247)'
        }
    });
    
    const classes = useStyles();

    return(
        <div className='loading-wrapper'>
            <div className = 'loading'>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
                <div className='bar'/>
            </div>
            <Typography className={classes.root}>{text}</Typography>
        </div>
)}