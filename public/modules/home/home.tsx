import React from "react";
import { Card } from '../../components/ui/card';
import { Editor } from '../../components/services/editor';

export default function Home() {

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