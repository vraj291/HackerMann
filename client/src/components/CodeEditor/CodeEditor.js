import React, { useEffect } from 'react'
import {CodeSegment} from './CodeSegment/CodeSegment'
import {LineNumbers} from './LineNumbers/LineNumbers'
import {CustomInput} from './CustomInput/CustomInput'
import './CodeEditor.css'

export const CodeEditor = (props) => {

    useEffect(() => {
        let ele = document.querySelector('.code-segment .MuiInputBase-input')
        ele.addEventListener('scroll',(e) => {
            let side = document.querySelector('.lines .MuiInputBase-input')
            let main = document.querySelector('.code-segment .MuiInputBase-input')
            side.scrollTop = main.scrollTop
        })
    },[])

    return(
        <>
            <div className='input-wrapper'>
                <LineNumbers
                    code = {props.code}
                />
                <CodeSegment 
                    code = {props.code}
                    handleCode = {props.handleCode}
                />
            </div>
            <CustomInput
                input = {props.customInput}
                handleInput = {props.handleCustomInput}
            />
        </>
)}