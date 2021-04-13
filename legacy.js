export const CodeEditor = (props) => {

    const handleOtherKeys = (e) => {
        if(e.keyCode == 9){
            props.code[props.code.length - 1] += '\t'
            //ref.focus()
        }
        else if(e.keyCode == 13){
            props.handleCode([...props.code,''])
        }
    }

    const handleInput = (e) => {
        let rest = props.code.slice(0,props.code.length-1)
        let key = props.code[props.code.length-1]
        if (e.nativeEvent.inputType == 'insertLineBreak'){
            return
        }else if (e.nativeEvent.inputType == 'deleteContentBackward'){
            if (key.length > 1){
                key = key.substring(0,key.length - 1)
                props.handleCode([...rest,key])
            }else{
                props.handleCode([...rest])
            }
        }else{
            key += e.nativeEvent.data
            props.handleCode([...rest,key])
        }
    }

    return(
        <div 
            className='editor'
            onKeyDown = {handleOtherKeys}
        >
            {props.code.map((element,val) =>
                <CodeSegment 
                    val = {val}
                    text = {element}
                    handleInput = {handleInput}
                /> 
            )}
        </div>
)}
