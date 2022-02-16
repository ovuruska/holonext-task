import React from "react"
import "./style.css"
import RootButton from "../../../components/RootButton"
import icon from "./icon.svg"

const HamburgerButton =  ({onClick = null,className = ""}) => {
    return <RootButton onClick={onClick} className={"hamburger-button "  + className} icon={icon}>
        <img alt={"Hamburger icon"} src={icon} />

    </RootButton>
}
export default HamburgerButton