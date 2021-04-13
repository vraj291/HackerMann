import React,{useState} from 'react'
import {CodeEditor} from './components/CodeEditor/CodeEditor'
import {Controls} from './components/Controls/Controls'
import {Output} from './components/Output/Output'
import {Footer} from './components/Footer/Footer'
import {languages} from './components/languages'
import './App.css';

export const App = () => {

  const [code,setCode] = useState("print('Hello World')")
  const [lang,setLang] = useState('C')
  const [response,setResp] = useState({})
  const [input,setInput] = useState('')
  const [he_id,setHe_id] = useState(undefined)

  const handleExecute = async () => {
    let data = JSON.stringify({
      source : code,
      lang : languages[lang],
      input : input,
      he_id : he_id
    })
    let headers = {'Content-Type': 'application/json'}
    setResp({compiling : 'true'})
    await fetch("http://localhost:8080/execute",{method:'post', body : data, headers : headers })
    .then(rs => rs.text())
    .then(body => setResp(JSON.parse(body)))
    .catch(err => console.log(err))
  }

  return (
    <div className="App">
      <Controls
        code = {code}
        lang = {lang}
        handleLang = {(e) => setLang(e)}
        handleExecute = {async () => await handleExecute()}
      />
      <CodeEditor
        code = {code}
        handleCode = {(e) => setCode(e)}
        customInput = {input}
        handleCustomInput = {(e) => setInput(e)}
      />
      <Output
        response = {response}
      />
      <Footer/>
    </div>
  )
}
