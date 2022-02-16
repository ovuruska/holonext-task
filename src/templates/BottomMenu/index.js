import React,{useState} from "react"
import "./style.css"
import HamburgerButton from "./HamburgerButton";

const BottomMenu = () => {

    const [menuActive, setActive] = useState(false)

    let classModifier

    if (menuActive) classModifier = "navbar--active"
    else classModifier = "navbar--disabled"

    const toggleMenu = () => setActive(!menuActive)

    return <>
        <div  className="navbar__button-container">
            <HamburgerButton onClick={toggleMenu}/>
        </div>
        <ul className={"navbar " + classModifier}>

            <li className={"navbar__item"}>Hizmet Şartları</li>
            <li className={"navbar__item"}>İletişim</li>
        </ul>
    </>
}

export default BottomMenu