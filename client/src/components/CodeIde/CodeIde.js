import React,{useEffect, useState} from 'react'
import socketIOClient from "socket.io-client";
import {UserList} from '../UserList/UserList'
import {CodeEditor} from '../CodeEditor/CodeEditor'
import {Controls} from '../Controls/Controls'
import {Chat} from '../Chat/Chat'
import {Output} from '../Output/Output'
import {Footer} from '../Footer/Footer'
import { LoadingScreen } from '../CreateUser/LoadingScreen/LoadingScreen';
import {languages} from '../../utils/languages'
import {boilerplate} from '../../utils/boilerplate'
import {Redirect} from 'react-router-dom'
import {leaveRoom} from '../../api/rooms/api_room'
import { getJWT, isAuthenticated } from '../../api/auth/auth_helpers';
import './CodeIde.css'
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { executeCode } from '../../api/execute/api_execute';

export const CodeIde = (props) => {

    props = props.location.state

    const [socket,setSocket] = useState(socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT,{forceNew : true}))
    const [users,setUsers] = useState(props.users)
    const [typing,setTyping] = useState(props.users.map((e) => false))
    const [lang,setLang] = useState('C')
    const [code,setCode] = useState(boilerplate[lang])
    const [response,setResp] = useState('')
    const [input,setInput] = useState('')
    const [typingTimeout,setTypingTimeout] = useState(undefined)
    const [loading,setLoading] = useState(true)
    const [leave,setLeave] = useState(false)

    useEffect(() => {

      const unloadEvent = async () => {
        await leaveRoom({
          user : props.user,
          code : props.room_id
        })
      }

      window.addEventListener("beforeunload",unloadEvent)

      socket.off('updateUsers')
      socket.off('getChanges_code')
      socket.off('getChanges_lang')
      socket.off('getChanges_output')
      socket.off('getChanges_input')
      socket.off('getTyping')

      socket.emit('joinRoom',props.room_id)

      socket.emit('addUser',{user : props.user,room_id : props.room_id})

      socket.on('getChanges_code', (_code) => { 
        setCode(_code)
      })
  
      socket.on('getChanges_lang', (_lang) => {
        setLang(_lang)
        setCode(boilerplate[_lang])
      })

      socket.on('getChanges_input', (_out) => {
        console.log(_out)
        setInput(_out)
      })

      socket.on('getChanges_output', (_out) => {
        setResp(_out)
      })

      socket.on('getTyping', (_user) => {
        setTypingStatus(_user)
      })

      socket.on("updateUsers", ({op,user}) => {
        let ind = users.findIndex((e) => e === user)
        if(op === 0){
          if(ind === -1){
            setUsers(prev => [...prev,user])
            setTyping(prev => [...prev,false])
          }
        }else{
          setUsers(prev => prev.filter((e) => e !== user))
          setTyping(prev => [...prev.slice(0,ind-1),...prev.slice(ind+1)])
        }
      })

      return () => window.removeEventListener("beforeunload",unloadEvent)

    },[])
  
    const handleLang = (e) => {
      setLang(e)
      setCode(boilerplate[e])
      socket.emit('makeChanges_lang',{new_lang : e,room_id : props.room_id})
    }
    
    const handleInput = (e) => {
      setInput(e)
      clearTimeout(typingTimeout)
      setTypingTimeout(setTimeout(stopTyping,1000))
      socket.emit('makeChanges_input',{new_inp: e,room_id : props.room_id})
      socket.emit('isTyping', {user: {user_name:props.user, typing:true},room_id : props.room_id})
    }

    const handleCode = (e) => {
      setCode(e)
      clearTimeout(typingTimeout)
      setTypingTimeout(setTimeout(stopTyping,1500))
      socket.emit('makeChanges_code',{new_code : e,room_id : props.room_id})
      socket.emit('isTyping', {user: {user_name:props.user, typing:true},room_id : props.room_id})
    }

    const setTypingStatus = (user) => {
      setTyping(prev => {
        console.log(users)
        console.log(prev)
        let ind = users.findIndex((e) => e === user.user_name)
        prev[ind] = user.typing
        console.log(prev)
        return prev
      }) 
    }

    const stopTyping = () => {
      socket.emit('isTyping', {user: {user_name:props.user, typing:false},room_id : props.room_id})
    }

    const clearCode = () => {
      handleCode(boilerplate[lang])
    }

    const handleExecute = async (he_id) => {
        let data = JSON.stringify({
          source : code,
          lang : languages[lang],
          input : input,
          he_id : he_id
        })
        setResp(true)
        socket.emit('makeChanges_output',{new_out : true,room_id : props.room_id})
        executeCode(data).then(({err,data}) => {
          if(!err){
            setResp(data)
            socket.emit('makeChanges_output',{new_out : data,room_id : props.room_id})
          }
        })
    }

    const useStyles = makeStyles({
      code: {
          color : '#FAFAFA',
          fontFamily : "'Saira Condensed', sans-serif"
      }
    });

    const classes = useStyles();
    
    if(!isAuthenticated()){
      return <Redirect to='/'/>
    }

    if(leave){
      return <Redirect to={`/profile/${props.user}`}/>
    }

    return (
      <>
        {loading? 
        <div>
          <Chat
            user = {props.user}
            room_id = {props.room_id}
            socket = {socket}
          />
          <Controls
            code = {code}
            lang = {lang}
            handleLang = {handleLang}
            handleExecute = {async () => await handleExecute(undefined)}
            handleClear = {clearCode}
            handleLeaveRoom = {() => {
              setLoading(false)
              leaveRoom({
                user : props.user,
                code : props.room_id
              }).then(() => {
                socket.emit('deleteUser',{user : props.user,room_id : props.room_id})
                socket.emit('leaveRoom',props.room_id)
                socket.disconnect()
                setLeave(true)
              })
            }}
          />
          <div className='room-code-wrapper'>
            <Typography variant='h4' className={classes.code}>
              Room Code : {props.room_id}
            </Typography>
          </div>
          <UserList
            users = {users}
            typing = {typing}
          />
          <CodeEditor
            code = {code}
            handleCode = {handleCode}
            customInput = {input}
            handleCustomInput = {handleInput}
          />
          <Output
            response = {response}
            handleQueue = {(e) => setTimeout(async () => await handleExecute(e),5000)}
          />
          <Footer/>
        </div> :
        <LoadingScreen text="LEAVING ROOM"/>}
      </>  
    )
}