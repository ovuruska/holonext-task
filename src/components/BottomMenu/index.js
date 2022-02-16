import React from "react"
import "./style.css"

export default ({active}) => {

    let classModifier
    if(active) classModifier = "navbar--active"
    else classModifier = "navbar--disabled"


    return <ul className={"navbar " + classModifier}>
            <li className={"navbar__item"}>Hizmet Şartları</li>
            <li className={"navbar__item"}>İletişim</li>
        </ul>
}