import React from 'react'
import {CodeSegment} from './CodeSegment/CodeSegment'
import {LineNumbers} from './LineNumbers/LineNumbers'
import {CustomInput} from './CustomInput/CustomInput'
import './CodeEditor.css'

export const CodeEditor = (props) => {

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