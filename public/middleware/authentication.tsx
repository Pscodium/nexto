/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// AuthMiddleware.tsx


/**
 * This middleware is deprecated and will be removed
 */


// import React, { useEffect, useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { api, UserProps } from '../lib/api';
// import Loader from '../common/Loader';

// export interface ChildProps {
//     authUser?: UserProps | undefined;
// }

// export interface AuthMiddlewareProps {
//     children: JSX.Element | React.LazyExoticComponent<() => JSX.Element>
// }

// export default function Authenticate({ children }: AuthMiddlewareProps) {
//     const [authUser, setAuthUser] = useState<UserProps>();
//     const maxRetrys = 200;
//     const navigate = useNavigate();
//     const isAuth = api.isUserAuthenticated();

//     async function initialize() {
//         let retry = 0;

//         while (retry < maxRetrys) {
//             if (isAuth == true) {
//                 getUserData();
//                 break;
//             }
//             if (retry == maxRetrys) {
//                 navigate('/login');
//             }

//             retry = retry + 1;

//         }
//     }

//     useEffect(() => {
//         initialize();
//     }, []);

//     async function getUserData() {
//         try {
//             const user = await api.getUserData();
//             setAuthUser(user);
//         } catch (e) {
//             console.error(e);
//         }

//     }

//     return (
//         <>
//             {authUser ?
//                 <>
//                     {isAuth ?
//                         React.cloneElement(children as React.DetailedReactHTMLElement<any, HTMLElement>, { authUser })
//                         :
//                         <Navigate to={'/login'} />
//                     }
//                 </>
//                 :
//                 <Loader />
//             }

//         </>
//     );
// }