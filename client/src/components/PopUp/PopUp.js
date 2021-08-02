import React, { useEffect, useState } from 'react'
import checkmark from '../../assets/checkmark.png'
import crossmark from '../../assets/crossmark.png'
import { makeStyles } from '@material-ui/core/styles';
import './PopUp.css'

export const PopUp =({err,url,onclose}) => {

    const useStyles = makeStyles({
        close:{
            marginLeft : '0.8rem',
            height: '2rem',
            width : '2rem'
        },

    })

    const classes = useStyles()

    useEffect(() => {
        setTimeout(() => document.getElementsByClassName('popup-wrapper')[0].classList.add('timer'),1000)
        setTimeout(() => onclose(),5500)
    },[])

    return(
        <div className='popup-wrapper'>
            <div className='popup'>
                <img src={err? crossmark : checkmark} className='status-icon'/>
                <a href={url}>{err? 'An Error Occurred' : 'New Playlist Created'}</a>
                {/* <IconButton className={classes.close} onClick={() => {clearTimeout(timeOut); onclose()}}>
                    <CloseIcon fontSize='small'/>
                </IconButton> */}
            </div>
        </div>
    )
}