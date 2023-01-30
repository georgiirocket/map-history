import React from "react"
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { PicturesWithLoad } from "../PicturesWithLoad/PicturesWithLoad";
import { PhotoSliderProps } from "../../interface/interface_default";
import picture_default from "../../images/default-image.jpg"

import 'react-slideshow-image/dist/styles.css'
import "../../sass/_photoslider.scss"

export const PhotoSlider: React.FC<PhotoSliderProps> = ({ slides, height = "200", width = "100%", scrollStap = 150 }) => {
    const styleBtn: React.CSSProperties = {
        opacity: slides.length > 1 ? 1 : 0
    }

    const scrollBy = (t: "right" | "left", stap: number): void => {
        const elem = document.querySelector(".slide-container-custom")
        if (elem) {
            elem.scrollTo({
                left: t === "right" ? elem.scrollLeft + stap : elem.scrollLeft - stap,
                behavior: 'smooth'
            });
        }
    }

    if (!slides.length) {
        return (
            <div className="slide-container">
                <PicturesWithLoad
                    disabled={true}
                    lazyLoading="lazy"
                    widthPictures={width}
                    heightPictures={height}
                    styleImg={{ objectFit: "contain", borderRadius: "5px" }}
                    src={picture_default}
                />
            </div>
        )
    }
    return (
        <div className="slider-block">
            <ArrowCircleLeftIcon onClick={() => scrollBy("left", scrollStap)} className="sl-icon" sx={styleBtn} />
            <div className="slide-container-custom">
                {slides.map((slideImage, index) => (
                    <div className="slider-box" key={slideImage.url + index.toString()}>
                        <PicturesWithLoad
                            lazyLoading="lazy"
                            widthPictures={width}
                            heightPictures={height}
                            styleImg={{ objectFit: "contain", borderRadius: "5px" }}
                            src={slideImage.url}
                        />
                    </div>
                ))}
            </div>
            <ArrowCircleRightIcon onClick={() => scrollBy("right", scrollStap)} className="sl-icon" sx={styleBtn} />
        </div>
    )
}