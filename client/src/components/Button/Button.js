import React from 'react'
import './Button.css'

export const Button = (props) => {
    return(
        <div 
            className = 'butt'
            style = {{background: props.color}}
            onClick = {props.onClick}
        >
        </div>
)}