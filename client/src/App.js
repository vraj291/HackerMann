import React,{useState} from 'react'
import socketIOClient from "socket.io-client";
import {HashRouter,Switch,Route} from 'react-router-dom'
import {Login} from './components/Login/Login'
import {Profile} from './components/Profile/Profile'
import {CodeIde} from './components/CodeIde/CodeIde'
import './App.css';
import { PasswordReset } from './components/PasswordReset/PasswordReset';
import { getJWT } from './api/auth/auth_helpers';

const headers = {'Content-Type': 'application/json'}
const ENDPOINT = "http://localhost:8080";

export const App = () => {

  const [user,setUser] = useState('')
  const [room,setRoom] = useState({})
  const [socket,setSocket] = useState(null)

  const createRoom = (u,r) => {
  
    let data = JSON.stringify({
      user_name : u,
      room_name : r
    })

    return fetch(`${process.env.REACT_APP_BACKEND_URI}/createroom`,
      {method:'post', body : data, headers : {
        'Authentication' : `JWT ${getJWT()}`
      }})
      .then(rs => rs.text())
      .then(body => {
        let result = JSON.parse(body)
        setUser(result.users[result.users.length-1])
        let temp_socket = socketIOClient(ENDPOINT,{forceNew : true})
        setSocket(temp_socket)
        console.log(temp_socket)
        setRoom({
          ...result,
          typing : result.users.map((e) => false)
        })
        temp_socket.emit("addUser", result)
        temp_socket.on("updateUsers", details => {
          if(Object.keys(room).length !== 0){
          if(room.users.length !== details.users.length){
            setRoom({
              room_name : room.room_name,
              users : [...room.users,details.users[details.users.length-1]],
              typing : [...room.typing,false]
            })
          }
          }else{
            setRoom({
              ...details,
              typing : details.users? details.users.map(e => false) : null
            })
          }
          console.log('updat users')
        })
      })
      .catch(err => console.log(err))

  }

  const joinRoom = () => {
    
  }

  const leaveRoom = (u,r) => {

    let data = JSON.stringify({
      user_name : u,
      room_name : r   
    })

    return fetch("http://localhost:8080/api/leaveroom",{method:'post', body : data, headers : headers })
    .then(rs => {
      socket.off('updateMessages')
      socket.off('getChanges_code')
      socket.off('getChanges_lang')
      socket.off('getChanges_output')
      socket.off('getTyping')
      socket.removeAllListeners()
      socket.disconnect()
      setSocket(null)
      setUser('')
      setRoom({})
    })
    .catch(err => console.log(err))

  }

  const setTypingStatus = (user) => {
    setRoom(prev => {
      console.log(prev)
      let ind = prev.users.findIndex((e) => e === user.user_name)
      let typing = prev.typing
      if(typing[ind] != user.typing){
        typing[ind] = user.typing
        console.log(prev)
        return {
         room_name : prev.room_name,
         users : prev.users,
         typing
        }
      }else{
        return prev
      }
    }) 
  }

  return(
    <>
      {/* {user.length === 0 ?
        <Login setUser={(e) => setUser(e)}/> : 
        <>
        {room.users == undefined || room.users.length == 0 ? (        
          <Profile 
            user = {user} 
            createRoom = {createRoom}
            joinRoom = {joinRoom}
          />
        ):(
          <CodeIde
            user = {user}
            users = {room.users}
            typing = {room.typing}
            setTypingStatus = {setTypingStatus}
            room = {room.room_name}
            socket = {socket}
            leaveRoom = {leaveRoom}
          />
        )}
        </>
      }  */}
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Login}/>
          <Route path='/passwordReset/:user/:token' component={PasswordReset}/>
          <Route path='/profile/:user' component={Profile}/>
          <Route path='/room/:room_name' render={(props) => <CodeIde {...props}/>}/>
        </Switch>
      </HashRouter>
    </>
  )
}
