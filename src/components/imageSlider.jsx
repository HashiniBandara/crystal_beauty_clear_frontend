import { useState } from "react";

export default function ImageSlider(props) {
    const images=props.images;
    const[activeImage,setActiveImage]=useState(images[0]);

    return(
        <div className="w-full h-full flex justify-center items-center">
        <div className="w-[80%] aspect-square bg-gray-200 relative">
            <img src={activeImage} className="w-full h-full object-cover" />
            <div className="w-full h-[100px] absolute backdrop-blur-3xl bottom-0 left-0 flex justify-center items-center">
                {
                    images.map(
                        (images,index)=>{
                           return( <img key={index} src={images} className="h-full aspect-square mx-[5px] cursor-pointer" onClick={
                               ()=>{
                                   setActiveImage(images);
                               }
                           } />)
                        }
                    )
                }
            </div>
        </div>
        </div>
    )
}