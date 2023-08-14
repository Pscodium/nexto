import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from '../modules/map/map';
import Home from '../modules/home/home';

export default function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
            <Routes>
                <Route path="/map" element={<Map />} />
            </Routes>
        </>
    );
}