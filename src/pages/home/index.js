import React,{useState} from "react"
import GridView from "../../templates/GridView"
import a from "./assets/a.jpeg"
import b from "./assets/b.jpeg"
import BottomMenu from "../../components/BottomMenu"
import HamburgerButton from "../../components/HamburgerButton";
import Pagination from "../../components/Pagination"
import "./style.css"

const grids = [
    {
        description:"Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.",
        image:b,
        username:"funny_deedee",
        name:"Roman",
        sceneId:"61b34cf157822f0039e090d6",
        creator:"funny_deedee"

    },
    {
        sceneId:"61d82bb92e21d40039c73ffc",
        username:"provisionfree",
        image:a,
        name:"Not Determined",
        creator:"sameasyou",
        description:"Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before. Many say exploration is part of our destiny, but it’s actually our duty to future generations and their quest to ensure the survival of the human species."
    }
]

const Homepage =  () => {

    const [menuActive,setActive] = useState(false)


    return <div className={"homepage-container"}>
        <section id={"homepage-pagination"}>
            <Pagination>
                {
                    grids.map(({description,image,username,name,sceneId,creator}) => <GridView key={sceneId} description={description} image={image} username={username} name={name} sceneId={sceneId} creator={creator}/>)
                }
            </Pagination>
        </section>
        <BottomMenu active={menuActive}/>
        <HamburgerButton onClick={() => setActive(!menuActive)} className="homepage__button--left-bottom-fixed"/>

    </div>
}

export default Homepage