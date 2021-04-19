import React, { useEffect, useState } from 'react'
import {Forum} from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, InputBase, Typography } from '@material-ui/core'
import './Chat.css'

const ClosedChat = (props) => {
    return(
        <div className = 'closed-chat'>
            <IconButton onClick = {props.handleOpen}>
                <Forum/>
            </IconButton>
        </div>
)}

const OpenChat = (props) => {

    const [currMsg,setCurrMsg] = useState('')
    const [error,setError] = useState('')

    const useStyles = makeStyles({
        title: {
            fontSize : 'large',
            fontFamily : "'Saira Condensed', sans-serif"
        },
        typed_msg: {
            fontSize : 'medium',
            fontFamily : "'Saira Condensed', sans-serif"
        },
        inner_msg : {
            color : '#FAFAFA',
            fontFamily : 'Lucida Console',
            fontSize : 'small',
            padding : '0.3rem 0.5rem'
        },
        error:{
            fontSize : 'large',
            fontFamily : "'Saira Condensed', sans-serif"
        }
    });

    const classes = useStyles();

    return(
        <div className="open-chat">
            <div className='chat-header'>
                <Typography className={classes.title}>Messages</Typography>
                <div className="chat-close-button">
                    <IconButton style={{height:'1rem',width:'1rem'}}onClick = {props.handleClose}>
                        <CloseIcon fontSize='small'/>
                    </IconButton>
                </div>
            </div>
            <div className="chat-body">
                <InputBase
                    inputProps = {{className : classes.inner_msg}}
                    className = 'chat-msgs'
                    rows={7}
                    multiline 
                    value = {props.messages}
                    readOnly
                />
            </div>
            <div className='chat-footer'>
                <InputBase
                    inputProps = {{className : classes.typed_msg}}
                    multiline 
                    className = 'chat-msgs'
                    value = {currMsg}
                    placeholder = "Type a message"
                    onChange = {(e) => setCurrMsg(e.target.value)}
                    rowsMax={2}
                />
                <IconButton 
                    style={{
                        height:'1rem',
                        width:'1rem'
                    }}
                    onClick = {() => {
                        if(currMsg != ''){
                            props.addMessage(currMsg)
                            setError('')
                            setCurrMsg('')
                        }else{
                            setError(<div className="error">
                                        <Typography 
                                            className={classes.error}
                                        >Empty Message
                                        </Typography>
                                    </div>)
                        }
                    }}
                >
                    <SendIcon fontSize='small'/>
                </IconButton>
            </div>
            {error}
        </div>
)}

export const Chat = (props) => {
    
    const [open,setOpen] = useState(false)
    const [msgs,updateMsgs] = useState([])

    useEffect(() => { 
        props.socket.on('updateMessages', (msg) => {
            if(msg.user_name !== props.user)
                updateMsgs(prev => [...prev,msg])
        })
    },[])

    const addMessage = (msg) => {
        
        updateMsgs(prev => [...prev,{
            user_name: 'Me',
            msg
        }])

        props.socket.emit('addMessage',{
            user_name: props.user,
            msg
        })  

    }

    const formatMessages = (msgs) => {
        let out = ''
        for (let e of msgs){
            out += `${e.user_name} : ${e.msg}\n`
        }
        return out
    }
    
    return(
        <>
            {
            open? 
            <OpenChat
                messages = {formatMessages(msgs)}
                addMessage = {addMessage}
                handleClose = {() => setOpen(false)}
            />
            :
            <ClosedChat
                handleOpen = {() => setOpen(true)}
            />
            }
        </>
)}