import React, { useState } from "react";
import MapHeader from "./map.header";
import { useWindowSize } from "../../components/hooks/useWindowSize";
import Map from "./services/map.service";
import { SliderPicker } from 'react-color';

export default function HomePage() {
    const [pinColor, setPinColor] = useState('#00ff00');
    const windowSize = useWindowSize();
    const headerSize = 60;

    return (
        <>
            <MapHeader height={headerSize} />
            <div style={{ height: windowSize.height ? windowSize.height - headerSize : 0 }} className={`justify-center align-middle w-[100vw] bg-slate-100 flex items-center`}>
                <div className="bg-blue-300 flex w-[20vw] h-[100%] justify-center items-center">
                    <SliderPicker color={pinColor} className="h-[10px] w-[100%]" onChangeComplete={(color) => setPinColor(color.hex)} />
                </div>
                <div className=" bg-zinc-200 flex w-[60vw] h-[100%] justify-center items-center">
                    <Map headerHeight={headerSize} windowSize={windowSize} pinColor={pinColor} />
                </div>
                <div className="bg-blue-300 flex w-[20vw] h-[100%]">Something there</div>
            </div>
        </>
    );
}