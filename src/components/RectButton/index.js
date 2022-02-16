import React from "react"
import "./style.css"

export default ({onClick,className,icon,disabled}) => {
    return <button onClick={onClick} disabled={disabled} className={"rect-button "  + className}>
        <img src={icon} />
    </button>
}