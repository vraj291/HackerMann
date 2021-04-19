import React,{useEffect, useState} from 'react'
import {UserList} from '../UserList/UserList'
import {CodeEditor} from '../CodeEditor/CodeEditor'
import {Controls} from '../Controls/Controls'
import {Chat} from '../Chat/Chat'
import {Output} from '../Output/Output'
import {Footer} from '../Footer/Footer'
import {languages} from '../languages'
import {boilerplate} from '../boilerplate'
import './CodeIde.css'

const headers = {'Content-Type': 'application/json'}

export const CodeIde = (props) => {

    const [lang,setLang] = useState('C')
    const [code,setCode] = useState(boilerplate[lang])
    const [response,setResp] = useState('')
    const [input,setInput] = useState('')
    const [typingTimeout,setTypingTimeout] = useState(undefined)

    useEffect(() => {

      const unloadEvent = async () => {
        await props.leaveRoom(props.user,props.room)
      }

      window.addEventListener("beforeunload",unloadEvent)

      props.socket.on('getChanges_code', (_code) => { 
        setCode(_code)
      })
  
      props.socket.on('getChanges_lang', (_lang) => {
        setLang(_lang)
        setCode(boilerplate[_lang])
      })

      props.socket.on('getChanges_output', (_out) => {
        setResp(_out)
      })

      props.socket.on('getTyping', (_user) => {
        props.setTypingStatus(_user)
      })

      return () => window.removeEventListener("beforeunload",unloadEvent)

    },[])
  
    const handleLang = (e) => {
      setLang(e)
      setCode(boilerplate[e])
      props.socket.emit('makeChanges_lang',e)
    }
  
    const handleCode = (e) => {
      setCode(e)
      clearTimeout(typingTimeout)
      setTypingTimeout(setTimeout(stopTyping,1500))
      props.socket.emit('makeChanges_code',e)
      props.socket.emit('isTyping', {user_name:props.user, typing:true})
    }

    const stopTyping = () => {
      props.socket.emit('isTyping', {user_name:props.user, typing:false})
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
        props.socket.emit('makeChanges_output',true)
        await fetch("http://localhost:8080/api/execute",{method:'post', body : data, headers : headers })
        .then(rs => rs.text())
        .then(body => {
          setResp(JSON.parse(body))
          props.socket.emit('makeChanges_output',JSON.parse(body))
        })
        .catch(err => console.log(err))
    }
    
    return (
        <div>
          <Chat
            user = {props.user}
            socket = {props.socket}
          />
          <Controls
            code = {code}
            lang = {lang}
            handleLang = {handleLang}
            handleExecute = {async () => await handleExecute(undefined)}
            handleClear = {clearCode}
            handleLeaveRoom = {async () => await props.leaveRoom(props.user,props.room)}
          />
          <UserList
            users = {props.users}
            typing = {props.typing}
          />
          <CodeEditor
            code = {code}
            handleCode = {handleCode}
            customInput = {input}
            handleCustomInput = {(e) => setInput(e)}
          />
          <Output
            response = {response}
            handleQueue = {(e) => setTimeout(async () => await handleExecute(e),3000)}
          />
          <Footer/>
        </div>
      )
}