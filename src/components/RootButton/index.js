import React from "react"
import "./style.css"

export default ({onClick,className,children}) => {
    return <button onClick={onClick} className={"button-primary "  + className}>
        {children}
    </button>
}