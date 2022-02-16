import React,{useState} from 'react'
import "./style.css"

const HolonextViewer = ({sceneId}) => {

    return <holonext-viewer sceneId={sceneId}/>
}

export default ({sceneId}) => {

    const [loaded,setLoad] = useState(false)

    if(loaded){
        return <HolonextViewer sceneId={sceneId}/>
    }else{
        return <div className={"holonext-viewer"}>
            <button className={"holonext-viewer__button"} onClick={() => setLoad(true)}>3D olarak görüntüle</button>
        </div>
    }

}