import React from 'react';
import LoginComponent from './services/login.service';

export default function Login() {
    return (
        <div className='items-center justify-center min-h-screen flex'>
            <div className='w-[360px]'>
                <LoginComponent className='w-[100%] items-center justify-center flex flex-col'/>
            </div>
        </div>
    );
}