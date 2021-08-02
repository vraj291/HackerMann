import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import {AddCircleOutlined} from '@material-ui/icons'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import './Profile.css'
import { LoadingScreen } from '../CreateUser/LoadingScreen/LoadingScreen';
import {Redirect} from 'react-router-dom'
import {createRoom,joinRoom} from '../../api/rooms/api_room'
import { isAuthenticated, signOut } from '../../api/auth/auth_helpers';

export const Profile = () => {

    const {user} = useParams()

    const [room,setRoom] = useState('hello')
    const [code,setCode] = useState('')
    const [loading,setLoading] = useState(false)
    const [failMsgs,setfailMsgs] = useState(['',''])

    const [redirectState,setRedirectState] = useState([false,{}])

    const useStyles = makeStyles((theme) => ({
        root: {
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold',
            color: 'rgb(170, 202, 250)'
        },
        inner:{
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold',
            color: 'black'
        },
        butt:{
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold',
            color: 'white'
        },
        log_butt:{
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold',
            color: 'white',
            fontSize : '1.3rem'
        },
        label:{
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bolder',
            cursor : 'pointer'
        }
    }))

    const classes = useStyles();

    const onCreate = () => {
        setLoading(true)
        createRoom({
            room_name : room,
            user : user
        }).then(({err,data}) => {
            setLoading(false)
            if(err){
                setfailMsgs(prev => [data,''])
            }else{
                setfailMsgs(prev => ['',''])
                setRedirectState(prev => [true,data])
            }
        })
    }

    const onJoin = () => {
        setLoading(true)
        joinRoom({
            code : code,
            user : user
        }).then(({err,data}) => {
            setLoading(false)
            if(err){
                setfailMsgs(prev => [data,''])
            }else{
                setfailMsgs(prev => ['',''])
                setRedirectState(prev => [true,data])
            }
        })
    }

    if(!isAuthenticated()){
        return <Redirect to='/'/>
    }

    if(redirectState[0]){
        console.log(redirectState)
        return <Redirect to = {{
            pathname : `/room/${redirectState[1].room_name}`,
            state : {
                user : user,
                room : redirectState[1].room_name,
                users : redirectState[1].users,
                room_id : redirectState[1].room_id
            }
        }}/>
    }

    return(
        <>
        {!loading?
        <div className='profile-wrapper'>
            <div className='profile-title'>
                <Typography variant='h3' className={classes.root}>
                    WELCOME {user.toUpperCase()}
                </Typography>
                <Typography variant='h4' className={classes.root}>
                    Start Coding
                </Typography>
            </div>
            <div className='profile-card-wrapper'>
            <div className='profile-card'>
                <Typography variant='h5' className={classes.inner}>
                   Create a New Room
                </Typography>
                <InputLabel
                    className = {classes.label}
                    color = 'secondary'
                >{failMsgs[0]}</InputLabel>
                <TextField 
                    className={classes.inner}
                    label="Room Name" 
                    variant="outlined"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutlined/>}
                    onClick={onCreate}
                >
                    <Typography className={classes.butt}>Create Room</Typography>
                </Button>
            </div>
            <div className='profile-card'>
                <Typography variant='h5' className={classes.inner}>
                   Join an Existing Room
                </Typography>
                <InputLabel
                    className = {classes.label}
                    color = 'secondary'
                >{failMsgs[1]}</InputLabel>
                <TextField 
                    className={classes.inner}
                    label="Room Code" 
                    variant="outlined"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutlined/>}
                    onClick={onJoin}
                >
                    <Typography className={classes.butt}>Join Room</Typography>
                </Button>
            </div>
            </div>
            <div className='log-out'>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<RemoveCircleOutlineIcon/>}
                    onClick={() => {
                        signOut()
                        setRedirectState(prev => [false,{}])
                    }}
                >
                    <Typography className={classes.log_butt}>Log Out</Typography>
                </Button>
            </div>
        </div> :
        <LoadingScreen text="GETTING READY"/>
    }
    </>
    )
}