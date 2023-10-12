import React, { useEffect, useState } from "react";
import { MdSpaceDashboard } from 'react-icons/md';
import { HiHome, HiUser } from "react-icons/hi2";
import { NavLink, useLocation } from "react-router-dom";
import Loader from "../../../common/Loader";

interface SidebarProps {
    width: string;
}

export default function Sidebar({ width }: SidebarProps) {
    const location = useLocation();
    const [isHome, setIsHome] = useState(false);

    useEffect(() => {
        if (location.pathname === '/admin') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
    }, [location]);

    return (
        <div className={`w-[${width}px] min-h-screen`}>
            {width?
                <div className={`w-[${width}px] bg-slate-700 h-full`}>
                    <div className="flex flex-row h-[60px] border-b border-b-slate-500 items-center justify-center gap-3">
                        <MdSpaceDashboard className="fill-slate-100 w-6 h-6" />
                        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
                    </div>
                    <div>
                        <div className="flex flex-col gap-3 items-center py-4">
                            <NavLink
                                to=''
                                className={ isHome? 'bg-slate-600 p-3 w-[calc(100%-25px)] rounded-lg' : 'p-3 w-[calc(100%-25px)]'}
                            >
                                <div className="flex flex-row items-center gap-2">
                                    <HiHome className="fill-slate-100" />
                                    <span className="text-slate-100 font-bold text-base">
                                        Home
                                    </span>
                                </div>
                            </NavLink>
                            <NavLink
                                to='users'
                                className={({ isActive }) =>
                                    isActive? 'bg-slate-600 p-3 w-[calc(100%-25px)] rounded-lg' : 'p-3 w-[calc(100%-25px)]'
                                }
                            >
                                <div className="flex flex-row items-center gap-2">
                                    <HiUser className="fill-slate-100" />
                                    <span className="text-slate-100 font-bold text-base">
                                        Users
                                    </span>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
                :
                <Loader />
            }

        </div>
    );
}