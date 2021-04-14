import React,{useState} from 'react'
import socketIOClient from "socket.io-client";
import {CodeEditor} from './components/CodeEditor/CodeEditor'
import {Controls} from './components/Controls/Controls'
import {Output} from './components/Output/Output'
import {Footer} from './components/Footer/Footer'
import {languages} from './components/languages'
import './App.css';

const ENDPOINT = "http://localhost:8080";

export const App = () => {

  const [code,setCode] = useState("for i in range(5):\n\tprint(i)")
  const [lang,setLang] = useState('C')
  const [response,setResp] = useState('')
  const [input,setInput] = useState('')

  const socket = socketIOClient(ENDPOINT)

  socket.on('getChanges', (_code) => {
    setCode(_code)
  })

  const handleExecute = async (he_id) => {
    /*let data = JSON.stringify({
      source : code,
      lang : languages[lang],
      input : input,
      he_id : he_id
    })
    let headers = {'Content-Type': 'application/json'}
    setResp(true)
    await fetch("http://localhost:8080/api/execute",{method:'post', body : data, headers : headers })
    .then(rs => rs.text())
    .then(body => setResp(JSON.parse(body)))
    .catch(err => console.log(err))*/
  }

  return (
    <div className="App">
      <Controls
        code = {code}
        lang = {lang}
        handleLang = {(e) => setLang(e)}
        handleExecute = {async () => await handleExecute(undefined)}
      />
      <CodeEditor
        code = {code}
        handleCode = {(e) => setCode(e)}
        customInput = {input}
        handleCustomInput = {(e) => setInput(e)}
      />
      <Output
        response = {response}
        handleQueue = {(e) => setTimeout(async (e) => await handleExecute(e),3000)}
      />
      <Footer/>
    </div>
  )
}
