import React,{useState} from 'react'
import socketIOClient from "socket.io-client";
import {CreateUser} from './components/CreateUser/CreateUser'
import {CodeIde} from './components/CodeIde/CodeIde'
import './App.css';

const headers = {'Content-Type': 'application/json'}
const ENDPOINT = "http://localhost:8080";

export const App = () => {

  const [user,setUser] = useState('')
  const [room,setRoom] = useState({})
  const [socket,setSocket] = useState(null)

  const createRoom = async (u,r) => {
  
    let data = JSON.stringify({
      user_name : u,
      room_name : r
    })

    await fetch("http://localhost:8080/api/createroom",{method:'post', body : data, headers : headers })
      .then(rs => rs.text())
      .then(body => {
        let result = JSON.parse(body)
        setUser(result.users[result.users.length-1])
        let temp_socket = socketIOClient(ENDPOINT)
        setSocket(temp_socket)
        temp_socket.emit("addUser", result)
        temp_socket.on("updateUsers", details => {
          setRoom({
            ...details,
            typing : details.users.map((e) => false)
          })
          console.log('update users')
        })
        setRoom({
          ...result,
          typing : result.users.map((e) => false)
        })
      })
      .catch(err => console.log(err))

  }

  /*{
    room_name : result.room_name,
    users : result.users.map((e) => {
      return {
        user : e,
        typing: false 
      }
    })
  }*/


  const leaveRoom = async (u,r) => {

    setUser('')
    setRoom({})
    socket.disconnect()
    setSocket(null)

    let data = JSON.stringify({
      user_name : u,
      room_name : r   
    })

    await fetch("http://localhost:8080/api/leaveroom",{method:'post', body : data, headers : headers })
    .then(rs => rs.text())
    .then(body => console.log(body))
    .catch(err => console.log(err))

  }

  const setTypingStatus = (user) => {
    let ind = room.users.findIndex((e) => e === user.user_name)
    let typing = room.typing
    typing[ind] = user.typing
    console.log(room)
    console.log(typing)
    setRoom({
      room_name : room.room_name,
      users : room.users,
      typing
    })
  }

  return(
    <>
      {room.users == undefined || room.users.length == 0 ? (
        <CreateUser 
          createRoom={async(u,r) => await createRoom(u,r)}
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
  )
}
