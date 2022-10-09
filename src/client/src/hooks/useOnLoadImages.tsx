import { useState, useEffect, RefObject } from "react";

export const useOnLoadImages = (ref: RefObject<HTMLElement>, path: [string]) => {
    const [status, setStatus] = useState(false);
    useEffect(() => {
        const updateStatus = (images: HTMLImageElement[]) => {
            setStatus(
                images.map((image) => image.complete).every((item) => item === true)
            );
        };

        if (!ref?.current) return;

        const imagesLoaded = Array.from(ref.current.querySelectorAll("img"));
        if (imagesLoaded.length === 0) {
            setStatus(true);
            return;
        }
        imagesLoaded.forEach((image, index) => {
            image.addEventListener("load", () => updateStatus(imagesLoaded), {
                once: true
            });
            image.addEventListener("error", () => updateStatus(imagesLoaded), {
                once: true
            });
            image.src = path[index];
        });

        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    return status;
};