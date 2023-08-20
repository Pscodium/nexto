import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from '../modules/map/map';
import Home from '../modules/home/home';
import Login from '../modules/auth/login';
import Register from '../modules/auth/register';

export default function Router() {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
            </Routes>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />
            </Routes>
            <Routes>
                <Route
                    path="/map"
                    element={<Map />}
                />
            </Routes>
            <Routes>
                <Route
                    path="/register"
                    element={<Register />}
                />
            </Routes>
        </>
    );
}