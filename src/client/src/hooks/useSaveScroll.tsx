import { useEffect, RefObject, useRef } from "react";
import $ from 'jquery'

interface Props {
    ref?: RefObject<HTMLElement>,
    startScrollValue?: number,
    containerName?: string,
    animateTimeout?: number,
    timeOut?: number,
    handler: (par: number) => void
}

export const useSaveScroll = ({ timeOut = 500, handler, startScrollValue, containerName = 'test-conteiner-name', animateTimeout = 250 }: Props) => {
    const ref = useRef<HTMLHeadingElement>(null);
    let timeoutId: null | ReturnType<typeof setTimeout> = null
    const scrollHander = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            if (ref.current) {
                handler(ref.current.scrollTop)
            }
        }, timeOut)
    }
    useEffect(() => {
        if (startScrollValue) {
            let element = document.querySelector(`.${containerName}`)

            if (element) {
                $(element).animate({ scrollTop: startScrollValue }, animateTimeout)
            }
        }
        if (!ref?.current) {
            return
        }
        let element = ref.current
        element.addEventListener('scroll', scrollHander)
        return () => {
            element.removeEventListener('scroll', scrollHander)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { ref }
}