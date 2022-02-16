import React from "react";
import "./style.css";
import ItemCard from "../../components/ItemCard"
import ProfileCard from "../../components/ProfileCard"
import HolonextViewer from "../../components/HolonextViewer"

export default ({name,description,creator,username,image,sceneId}) => {
    return <div className={"gridview__root"}>
        <div className={"gridview__root__left-grid"}>
            <ItemCard name={name} description={description} creator={creator}/>
            <ProfileCard image={image} username={username}/>
        </div>
        <div className={"gridview__root__right-grid"}>
            <HolonextViewer sceneId={sceneId}/>
        </div>
    </div>
}