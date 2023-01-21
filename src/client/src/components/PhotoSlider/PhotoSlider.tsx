import React from "react"
import { Slide } from 'react-slideshow-image';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import { PicturesWithLoad } from "../PicturesWithLoad/PicturesWithLoad";
import { PhotoSliderProps } from "../../interface/interface_default";
import picture_default from "../../images/default-image.jpg"

import 'react-slideshow-image/dist/styles.css'
import "../../sass/_photoslider.scss"

export const PhotoSlider: React.FC<PhotoSliderProps> = ({ slides }) => {
    const properties = {
        prevArrow: <ArrowCircleLeftIcon />,
        nextArrow: <ArrowCircleRightIcon />
    }
    if (!slides.length) {
        return (
            <div className="slide-container">
                <PicturesWithLoad
                    disabled={true}
                    lazyLoading="lazy"
                    widthPictures="100%"
                    heightPictures="auto"
                    styleImg={{ objectFit: "contain", borderRadius: "5px" }}
                    src={picture_default}
                />
            </div>
        )
    }
    return (
        <div className="slide-container">
            <Slide
                autoplay={false}
                {...properties}
            >
                {slides.map((slideImage, index) => (
                    <div className="slider-pictures" key={slideImage.url + index.toString()}>
                        <PicturesWithLoad
                            lazyLoading="lazy"
                            widthPictures="100%"
                            heightPictures="auto"
                            styleImg={{ objectFit: "contain", borderRadius: "5px" }}
                            src={slideImage.url}
                        />
                    </div>
                ))}
            </Slide>
        </div>
    )
}