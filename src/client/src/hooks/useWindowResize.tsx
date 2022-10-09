import { useState, useEffect } from 'react'

interface Size {
    width: number,
    height: number,
}

export function useWindowSize(): Size {
    const [windowSize, setWindowSize] = useState<Size>({
        width: window.innerWidth ?? 0,
        height: window.innerHeight ?? 0,
    });
    useEffect(() => {
        function handleResize() {
            if (window) {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}