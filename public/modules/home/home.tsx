import React, { useEffect } from "react";
import { Card } from '../../components/ui/card';
import { Editor } from '../../components/services/editor';


import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = api.isUserAuthenticated();
        if (!isAuth) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex flex-col justify-center align-middle items-center bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 min-h-screen">
            <h1 className="font-black text-2xl">
            Hello World
            </h1>
            <Card className='w-[80vw] h-[80vh] overflow-hidden rounded-xl bg-slate-200'>
                <Editor />
            </Card>
            <p>
            Simplesmente intankável
            </p>
        </div>
    );
}