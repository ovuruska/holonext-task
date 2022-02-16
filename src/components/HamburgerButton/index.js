import React from "react"
import "./style.css"
import RootButton from "../RootButton"
import icon from "./icon.svg"

export default ({onClick = null,className = ""}) => {
    return <RootButton onClick={onClick} className={"hamburger-button "  + className} icon={icon}>
        <img src={icon} />

    </RootButton>
}