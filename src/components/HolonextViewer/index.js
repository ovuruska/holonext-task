import React,{useState} from 'react'
import "./style.css"



export default ({sceneId}) => {

    const [loaded,setLoad] = useState(false)
    if(loaded){
        return <div className={"holonext-viewer"}>
            <holonext-viewer sceneId={sceneId}></holonext-viewer>
        </div>
    }else{
        return <div className={"holonext-viewer"}>
            <button className={"holonext-viewer__button"} onClick={() => setLoad(true)}>3D olarak görüntüle</button>
        </div>
    }

}