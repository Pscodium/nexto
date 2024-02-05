/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { TableProps } from "./components/table.jsx";
import { Outlet } from "react-router-dom";
import Sidebar from './components/sidebar.js';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase.config";
import Loader from "@/common/Loader";
import { UserProps, api } from "@/lib/api";

export interface DashboardOutletContextProps {
    users: UserProps[];
    columns: TableProps[];
    user: UserProps;
    getUsers: () => Promise<void>;
    getLoggedUser: () => Promise<void>;
}

export default function Dashboard() {
    const [user] = useAuthState(auth);
    const [users, setUsers] = useState<UserProps[]>([]);
    const [loggedUser, setLoggedUser] = useState<UserProps>();

    useEffect(() => {
        if (user) {
            getUsers();
            getLoggedUser();
        }
    }, []);

    async function getUsers() {
        try {
            const res = await api.getUsers();

            setUsers(res);
        } catch (err) {
            setUsers([]);
            console.error(err);
        }
    }

    async function getLoggedUser() {
        try {
            const res = await api.getUserByExternalId(user?.uid);

            setLoggedUser(res);
        } catch (err) {
            if (!user) {
                api.navigator('/login');
            }
            console.error(err);
        }
    }


    return (
        <div className="flex min-h-screen w-full">
            {user ?
                <>
                    <Sidebar width="250" />
                    <div className={`w-[calc(100%-250px)]`}>
                        <Outlet context={{ users: users, user: loggedUser, getLoggedUser: getLoggedUser, getUsers: getUsers }} />
                    </div>
                </>
                :
                <Loader />
            }

        </div>
    );
}