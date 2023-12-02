import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from './components/sidebar';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase.config";
import Loader from "../../common/Loader";

export default function Dashboard() {

    const [user] = useAuthState(auth);

    return (
        <div className="flex min-h-screen w-full">
            {user ?
                <>
                    <Sidebar width="250" />
                    <div className={`w-[calc(100%-250px)]`}>
                        <Outlet />
                    </div>
                </>
                :
                <Loader />
            }

        </div>
    );
}