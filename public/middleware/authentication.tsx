/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// AuthMiddleware.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, UserProps } from '../lib/api';

export interface ChildProps {
    authUser?: UserProps | undefined;
}

export interface AuthMiddlewareProps {
    children: JSX.Element | React.LazyExoticComponent<() => JSX.Element>
}

export default function Authenticate({ children }: AuthMiddlewareProps) {
    const [authUser, setAuthUser] = useState<UserProps>();
    const navigate = useNavigate();
    const isAuth = api.isUserAuthenticated();

    useEffect(() => {
        if(isAuth) {
            getUserData();
        }
    }, []);

    async function getUserData() {
        try {
            const user = await api.getUserData();
            setAuthUser(user);
        } catch (e) {
            console.error(e);
            navigate('/login');
        }

    }

    return (
        <>
            {isAuth ?
                React.cloneElement(children as React.DetailedReactHTMLElement<any, HTMLElement>, { authUser })
                :
                <Navigate to={'/login'} />
            }
        </>
    );
}