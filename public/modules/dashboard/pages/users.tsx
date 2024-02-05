/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Loader from "@/common/Loader/index.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase.config.js";
import { DashboardOutletContextProps } from "../dashboard.js";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "@/components/ui/table/data-table.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { RegisterProps, UserPermissions, UserProps, api } from "@/lib/api.ts";
import { authServiceApi } from "@/modules/auth/services/auth.service.api.ts";
import { MoreHorizontal } from "lucide-react";
import { TiArrowSortedUp, TiArrowUnsorted, TiArrowSortedDown } from "react-icons/ti";
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserRegistrationDialog from '../components/user.register.dialog.tsx';
import PermissionDialog from '../components/permissions.dialog.tsx';
import UserDeleteDialog from '../components/user.delete.dialog.tsx';

type Users = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}


export default function Users() {
    const buttonClassName = "bg-slate-50 focus:bg-slate-200 cursor-pointer min-w-[100%] h-[100%]";
    const [user] = useAuthState(auth);
    const { toast } = useToast();
    const context = useOutletContext<DashboardOutletContextProps>();
    const loggedUser = context.user;

    const [showPermissionsDialog, setShowPermissionsDialog] = useState<boolean>(false);
    const [selectedUserDialog, setSelectedUserDialog] = useState<UserProps>();
    const [selectedUserPerms, setSelectedUserPerms] = useState<UserProps['permission'] | undefined>(selectedUserDialog?.permission);

    const [showUserRegistrationDialog, setShowUserRegistrationDialog] = useState<boolean>(false);
    const [creatingUserLoad, setCreatingUserLoad] = useState<boolean>(false);
    const [userRegisterData, setUserRegisterData] = useState<RegisterProps>({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        nickname: undefined,
        password: undefined
    });

    const [showUserDeleteDialog, setShowUserDeleteDialog] = useState<boolean>(false);

    const columns: ColumnDef<UserProps>[] = [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }

                    </Button>
                );
            },
            cell: ({ row }) => {
                return <div className="text-left ml-10 font-medium">{row.getValue('id')}</div>;
            },
        },
        {
            accessorKey: "nickname",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nick
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }
                    </Button>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }
                    </Button>
                );
            },
        },
        {
            accessorKey: "external_id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Firebase ID
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }
                    </Button>
                );
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }
                    </Button>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created
                        {column.getSortIndex() == -1 ?
                            <TiArrowUnsorted className="w-3 h-3 ml-1 text-gray-800" />
                            :
                            <>
                                {column.getIsSorted() == 'desc' ? (
                                    <TiArrowSortedUp className="w-3 h-3 ml-1 text-gray-800" />
                                ) : (
                                    <TiArrowSortedDown className="w-3 h-3 ml-1 text-gray-800" />
                                )}
                            </>
                        }
                    </Button>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            {loggedUser.permission && (
                                <DropdownMenuContent align="end" className="bg-slate-50">
                                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                                    <DropdownMenuItem className={buttonClassName} onClick={() => navigator.clipboard.writeText(String(user.id))}>Copy ID</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {loggedUser.permission.can_edit_user || loggedUser.permission.master_admin_level ?
                                        <>
                                            <DropdownMenuItem className={buttonClassName}>Edit</DropdownMenuItem>
                                        </>
                                        :
                                        null
                                    }
                                    {loggedUser.permission.can_manage_users_permissions || loggedUser.permission.master_admin_level ?
                                        <>
                                            <DropdownMenuItem onClick={() => permissionsOpenedDialog(user)} className={buttonClassName}>Permissions</DropdownMenuItem>
                                        </>
                                        :
                                        null
                                    }
                                    {loggedUser.permission.can_delete_user || loggedUser.permission.master_admin_level ?
                                        <>
                                            <DropdownMenuItem onClick={() => deleteUserOpenedDialog(user)} className={buttonClassName}><div className="text-red-700">Delete</div></DropdownMenuItem>
                                        </>
                                        :
                                        null
                                    }
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </>
                );
            },
        },
    ];

    async function permissionsOpenedDialog(user: UserProps) {
        setSelectedUserDialog(user);
        setShowPermissionsDialog(true);
    }

    async function updateUserPermissions(userId: number, data: UserPermissions) {
        try {
            const res = await api.updateUserPerms(userId, data);

            if (res) {
                setShowPermissionsDialog(false);
                context.getUsers();
                context.getLoggedUser();
                toast({
                    variant: "destructive",
                    title: "User permissions updated.",
                    description: `User ${selectedUserDialog?.nickname} permissions has been updated...`,
                    className: "outline-none bg-green-600 text-slate-200",
                });
            }

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "User permissions update error. Please try again...",
                className: "outline-none bg-red-600 text-slate-200",
            });
            console.error(err);
        }
    }

    function userRegistrationOpenedDialog() {
        if (!loggedUser.permission.can_add_user && !loggedUser.permission.master_admin_level) {
            return;
        }
        setUserRegisterData({
            email: '',
            firstName: '',
            lastName: '',
            nickname: '',
            password: ''
        });
        setShowUserRegistrationDialog(true);
    }

    async function createUser() {
        setCreatingUserLoad(true);
        try {
            const res = await authServiceApi.register(userRegisterData);

            if (res) {
                setShowUserRegistrationDialog(false);
                context.getUsers();
                context.getLoggedUser();
                setCreatingUserLoad(false);
                toast({
                    variant: "destructive",
                    title: "User successfully created.",
                    description: `User ${userRegisterData.nickname} created...`,
                    className: "outline-none bg-green-600 text-slate-200",
                });
            }

        } catch (err) {
            setShowUserRegistrationDialog(false);
            setCreatingUserLoad(false);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "User register error. Please try again...",
                className: "outline-none bg-red-600 text-slate-200",
            });
            console.error(err);
        }
    }

    async function deleteUserOpenedDialog(user: UserProps) {
        setSelectedUserDialog(user);
        setShowUserDeleteDialog(true);
    }

    async function deleteUser(userId: number | undefined) {
        try {
            const res = await api.deleteUser(userId);

            if (res) {
                setShowUserDeleteDialog(false);
                context.getUsers();
                context.getLoggedUser();
                toast({
                    variant: "destructive",
                    title: "User successfully deleted.",
                    description: `User ${selectedUserDialog?.nickname} deleted...`,
                    className: "outline-none bg-green-600 text-slate-200",
                });
            }

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "User delete error. Please try again...",
                className: "outline-none bg-red-600 text-slate-200",
            });
            console.error(err);
        }
    }

    return (
        <>
            {!user ?
                <Loader />
                :
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col w-[70vw]">
                        {context.users ?
                            <>
                                <DataTable
                                    userCallback={userRegistrationOpenedDialog}
                                    addUser={loggedUser.permission.can_add_user || loggedUser.permission.master_admin_level}
                                    columns={columns}
                                    data={context.users}
                                />
                                <PermissionDialog
                                    updateUserPermissions={updateUserPermissions}
                                    selectedUserDialog={selectedUserDialog}
                                    selectedUserPerms={selectedUserPerms}
                                    setSelectedUserPerms={setSelectedUserPerms}
                                    setShowPermissionsDialog={setShowPermissionsDialog}
                                    showPermissionsDialog={showPermissionsDialog}
                                />
                                <UserRegistrationDialog
                                    setShow={setShowUserRegistrationDialog}
                                    show={showUserRegistrationDialog}
                                    setValue={setUserRegisterData}
                                    value={userRegisterData}
                                    createUser={createUser}
                                    loading={creatingUserLoad}
                                />
                                <UserDeleteDialog
                                    show={showUserDeleteDialog}
                                    setShow={setShowUserDeleteDialog}
                                    user={selectedUserDialog}
                                    deleteUser={deleteUser}
                                />
                                <Toaster />
                            </>
                            :
                            <Loader />
                        }
                    </div>
                </div>
            }
        </>
    );
}