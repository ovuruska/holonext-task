import React,{useState} from "react"
import "./style.css"
import RectButton from "../../components/RectButton"
import left from "./assets/left.svg"
import right from "./assets/right.svg"

const SliderLeftButton = ({disabled,onClick,className=""}) => {
    return <RectButton onClick={onClick} icon={left} className={className} disabled={disabled}/>

}

const SliderRightButton = ({disabled,onClick,className=""}) => {
    return <RectButton onClick={onClick} icon={right} className={className} disabled={disabled}/>
}



const Slide = ({children,active}) => {

    if(active){
        return <div className={"pagination__slide pagination__slide--active"}>
            {children}
        </div>
    }else{
        return <div className={"pagination__slide pagination__slide--disabled"}>
            {children}
        </div>
    }

}

export default ({children}) => {

    const [currentSlide, setSlide ] =  useState(0)

    return <div className={"pagination"}>
        {
            children.map((child,index) => {
                return <Slide active={index === currentSlide} index={index}>
                    {child}
                </Slide>
            })
        }
        <section className={"pagination__controller"}>
            <SliderLeftButton className={"pagination__controller__button"} disabled={currentSlide === 0} onClick={() => setSlide(currentSlide-1)}/>
            <SliderRightButton className={"pagination__controller__button"} disabled={currentSlide === children.length-1} onClick={() => setSlide(currentSlide+1)}/>

        </section>
    </div>


}