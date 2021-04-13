import React from 'react'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton';
import { LinkedIn,GitHub } from '@material-ui/icons';
import './Footer.css'

export const Footer = (props) => {
    return(
        <div style={props.style} className='footer'>
            <div className='info'>
                <Typography variant='subtitle1'>Created by Vraj Parikh</Typography>
                <IconButton onClick={() => window.location='https://www.linkedin.com/in/vraj-parikh-200162193'}>
                    <LinkedIn fontSize="large"/>
                </IconButton>
            </div>
            <Typography variant='subtitle1'>Hosted on 
                <IconButton onClick={() => window.location='https://github.com/vraj291/HackerMann'}>
                    <GitHub fontSize="large"/>
                </IconButton>
            </Typography>
        </div>
    )
}