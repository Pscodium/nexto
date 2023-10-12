import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from './components/sidebar';
import { ChildProps } from "../../middleware/authentication";
import { UserProps } from "../../lib/api";

interface DashboardProps extends ChildProps {}

export interface DashboardOutletContextProps {
    authUser: UserProps | undefined;
}

export default function Dashboard({ authUser }: DashboardProps) {
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar width="250" />
            <div className={`w-[calc(100%-250px)]`}>
                <Outlet context={{ authUser }} />
            </div>
        </div>
    );
}