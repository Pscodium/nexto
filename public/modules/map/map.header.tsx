import React from "react";

interface MapHeaderProps {
    height: number;
}

export default function MapHeader({ height }: MapHeaderProps) {

    return (
        <>
            <div style={{ height: height }} className="w-[100vw] align-middle justify-center text-center flex items-center">
                <h1>Header</h1>
            </div>
        </>
    );
}