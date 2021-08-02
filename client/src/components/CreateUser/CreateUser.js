import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {AddCircleOutlined} from '@material-ui/icons'
import TextField from '@material-ui/core/TextField'
import './CreateUser.css'
import { Typography } from '@material-ui/core';
import {LoadingScreen} from './LoadingScreen/LoadingScreen'

export const CreateUser = ({createRoom})=> {

    const [user,setUser] = useState('')
    const [room,setRoom] = useState('')
    const [loading,setLoading] = useState(false)

    const useStyles = makeStyles({
        root: {
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold'
        }
    });

    const classes = useStyles();

    return(
        <>
        {loading === false ? (
            <div className ='create-user'>
                <Typography variant='h4' className={classes.root}>
                    Start Coding
                </Typography>
                <TextField 
                    InputLabelProps={{className : classes.root}}
                    label=" User" 
                    variant="filled" 
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <TextField
                    InputLabelProps={{className : classes.root}}  
                    label="Room" 
                    variant="filled" 
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutlined />}
                    onClick={() => {
                        createRoom(user,room).then(
                            setLoading(true)
                        )
                    }}
                >
                    <Typography className={classes.root}>Create/Enter Room</Typography>
                </Button>
            </div>
        ) : (
            <LoadingScreen/>
        )
    }    
    </>
)}