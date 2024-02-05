import React, { useEffect, useState } from "react";
import { MdSpaceDashboard } from 'react-icons/md';
import { HiHome, HiUser } from "react-icons/hi2";
import { NavLink, useLocation } from "react-router-dom";
import Loader from "@/common/Loader";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { MdGTranslate, MdNotifications } from "react-icons/md";
import { t } from "@/services/translate.config";

interface SidebarProps {
    width: string;
}

export default function Sidebar({ width }: SidebarProps) {
    const location = useLocation();
    const [isHome, setIsHome] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
        if (location.pathname === '/admin') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
    }, [location]);

    function setCurrentLanguage() {
        const lang = t.getLocale();
        setSelectedLanguage(lang);
    }

    useEffect(() => {
        setCurrentLanguage();
    }, []);

    function handleSelectLanguage(language: string) {
        setSelectedLanguage(language);
        t.setLocale(language);
    }

    return (
        <div className={`w-[250px] min-h-screen`}>
            {width ?
                <div className={`w-[250px] bg-slate-700 h-full`}>
                    <div className="flex flex-row h-[60px] border-b border-b-slate-500 items-center justify-center gap-3">
                        <MdSpaceDashboard className="fill-slate-100 w-6 h-6" />
                        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
                    </div>
                    <div>
                        <div className="flex flex-col gap-3 items-center py-4">
                            <NavLink
                                to=''
                                className={isHome ? 'bg-slate-600 p-3 w-[calc(100%-25px)] rounded-lg' : 'p-3 w-[calc(100%-25px)]'}
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
                                    isActive ? 'bg-slate-600 p-3 w-[calc(100%-25px)] rounded-lg' : 'p-3 w-[calc(100%-25px)]'
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
                    <div className="absolute w-[250px] bottom-0 h-[80px] p-2">
                        <div className="h-[100%] flex items-center justify-center align-middle border-t border-t-slate-600 gap-2">
                            <Select onValueChange={(value) => handleSelectLanguage(value)} defaultValue={selectedLanguage}>
                                <SelectTrigger className="border-slate-500 w-[100px] bg-slate-500" placeholder={t.translate('lang')}>
                                    <SelectValue>
                                        <MdGTranslate className="text-slate-100" />
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-500 border-slate-500 shadow-lg">
                                    <SelectGroup>
                                        <SelectLabel>Languages</SelectLabel>
                                        <SelectItem className="cursor-pointer hover:text-slate-600" value="pt">{t.translate('pt')}</SelectItem>
                                        <SelectItem className="cursor-pointer hover:text-slate-600" value="en">{t.translate('en')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button className="bg-slate-500 hover:bg-slate-600">
                                <MdNotifications className="text-slate-100" />
                            </Button>
                        </div>
                    </div>
                </div>
                :
                <Loader />
            }

        </div>
    );
}