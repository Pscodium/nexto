import React, { useEffect, useState, useRef } from "react";
import MapHeader from "./map.header";
import { useWindowSize } from "../../components/hooks/useWindowSize";
import Map from "./services/map.service";
import { BlockPicker } from 'react-color';
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from 'react-icons/io';
import './css/map.css';

export default function HomePage() {
    const [pinColor, setPinColor] = useState('#00ff00');
    const [openPalette, setOpenPalette] = useState(false);
    const mapRef = useRef<Map>(null);
    const windowSize = useWindowSize();
    const headerSize = 60;
    const navigate = useNavigate();
    const colors = [
        '#0071bc',
        "#00ff00",
        "#c02942",
        "#f8ca00",
        "#519548",
        "#45484b",
        "#f02475",
        "#009989",
        "#480048",
        "#82b3ae",
        "#c8ff00",
        "#4f2958"
    ];

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.changeColor(pinColor);
        }
    }, [pinColor]);

    function goToLoginPage() {
        navigate('/login');
    }

    function openColorPicker(openColorPicker: boolean) {
        setOpenPalette(openColorPicker);
    }

    function completeChangeColor(hex: string) {
        setPinColor(hex);
        setOpenPalette(false);
    }

    return (
        <>
            <MapHeader height={headerSize} />
            <div style={{ height: windowSize.height ? windowSize.height - headerSize : 0 }} className={`justify-center align-middle w-[100vw] bg-slate-100 flex items-center`}>
                <div className="flex w-[3vw] h-[100%] justify-center">
                    <button className="h-[50px] w-[50px] flex items-center justify-center absolute bottom-1 hover:bg-zinc-200">
                        <IoIosLogOut className="h-[20px] w-[20px] fill-[#464646]" />
                    </button>
                </div>
                <div className=" bg-zinc-200 flex w-[97vw] h-[100%] justify-center items-center">
                    {openPalette?
                        <div className={`absolute top-[112px] left-[0px]`}>
                            <BlockPicker colors={colors} color={pinColor} onChangeComplete={(color) => completeChangeColor(color.hex)} />
                        </div>
                        :
                        null
                    }
                    <Map headerHeight={headerSize} windowSize={windowSize} pinColor={pinColor} ref={mapRef} goToLoginPage={goToLoginPage} openColorPicker={openColorPicker}/>
                </div>
            </div>
        </>
    );
}