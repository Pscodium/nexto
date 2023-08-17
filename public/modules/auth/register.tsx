import React from 'react';
import RegisterComponent from '../../components/screen/register';

export default function Register() {
    return (
        <div className='items-center justify-center min-h-screen flex'>
            <div className='min-w-[20%]'>
                <RegisterComponent className='w-[100%] bg-slate-50 shadow-sm shadow-black/20'/>
            </div>
        </div>
    );
}