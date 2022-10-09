import React, { useRef } from "react";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useOnLoadImages } from '../../hooks/useOnLoadImages'
import '../../sass/_sceletorhidden.scss'

type Props = {
    customClass?: string,
    style?: any,
    pathImage: [string],
    children:
    | JSX.Element
    | JSX.Element[]
    | string
    | string[];
}

export const SkeletorHidden: React.FC<Props> = ({ children, customClass = '', pathImage, style = {} }) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const imagesLoaded = useOnLoadImages(wrapperRef, pathImage)
    return (
        <div ref={wrapperRef} style={style} className={`${customClass} sc-cust-wr`}>
            {!imagesLoaded ? (
                <Stack spacing={1}>
                    <Skeleton className="sc-cust-sceletor" variant="rectangular" />
                </Stack>
            ) : false}
            {children}
        </div>
    )
}