import React from "react"
import "./style.css"

export default ({name,description,creator}) => {
    return <section className={"item-card"}>
        <h2 className={"item-card__header"}>{name}</h2>
        <p className={"item-card__description"}>{description}</p>
        <p className={"item-card__creator"}>Created by {creator}</p>
    </section>
}