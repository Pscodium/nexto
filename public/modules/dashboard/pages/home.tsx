import React from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardOutletContextProps } from "../dashboard";

export default function DashboardHome() {
    const context = useOutletContext<DashboardOutletContextProps>();
    const user = context.authUser;

    return (
        <div className="w-full h-full flex items-center justify-center">
            home
        </div>
    );
}