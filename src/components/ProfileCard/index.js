import React from "react"
import "./style.css"

export default ({image,username}) => {
    return <section className={"profile-card"}>
        <img className="profile-card__image" src={image}/>
        <p className={"profile-card__username"}>{username}</p>
    </section>
}