import { useEffect, useState } from "react";

export interface WindowSizeProps {
    width: number | undefined;
    height: number | undefined;
}

const isClient = typeof window === 'object';

export function useWindowSize(): WindowSizeProps {
    const [windowSize, setWindowSize] = useState<WindowSizeProps>({
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
    });

    useEffect(() => {
        if (!isClient) {
            return;
        }

        const handleResize = () => {
            setWindowSize({
                width: window.innerHeight,
                height: window.innerHeight
            });

        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return windowSize;
}