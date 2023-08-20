import React from 'react';
import RegisterComponent from './services/register.service';

export default function Register() {
    return (
        <div className='items-center justify-center min-h-screen flex'>
            <div className='w-[360px]'>
                <RegisterComponent className='w-[100%] items-center justify-center flex flex-col'/>
            </div>
        </div>
    );
}