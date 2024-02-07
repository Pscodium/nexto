/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckedState } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import { Checkbox } from '@/components/ui/checkbox';
import { UserPermissions, UserProps } from '@/lib/api';
import { t } from '@/services/translate.config';

interface PermissionDialogProps {
    selectedUserDialog: UserProps | undefined;
    selectedUserPerms: UserPermissions | undefined;
    showPermissionsDialog: boolean;
    updateUserPermissions: (userId: number, data: UserPermissions) => Promise<void>;
    setShowPermissionsDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedUserPerms: React.Dispatch<React.SetStateAction<UserPermissions | undefined>>;
}

export default function PermissionDialog({ selectedUserDialog, selectedUserPerms, updateUserPermissions, setSelectedUserPerms, setShowPermissionsDialog, showPermissionsDialog}: PermissionDialogProps) {

    function handleChangePermission(key: string, checked: CheckedState) {
        if (typeof checked !== 'boolean' || !selectedUserPerms) {
            return;
        }
        const updatedPerms = { ...selectedUserPerms };
        updatedPerms[key] = checked;
        setSelectedUserPerms(updatedPerms);
    }

    useEffect(() => {
        if (!selectedUserDialog) {
            return;
        }
        setSelectedUserPerms(selectedUserDialog.permission);
    }, [selectedUserDialog]);


    return (
        <>
            {selectedUserDialog && selectedUserPerms && (
                <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
                    <DialogContent className="bg-white">
                        <DialogTitle className="text-[24px]">{t.translate('user_permission')}</DialogTitle>
                        <DialogDescription className="text-[12px]">
                           {t.translate('change_user_permission')}
                        </DialogDescription>
                        <div className="py-4 flex flex-col">
                            {Object.keys(selectedUserPerms).map((permission) => {
                                return (
                                    <div key={permission} className="flex flex-row gap-2 py-1">
                                        <Checkbox checked={selectedUserPerms[permission]} onCheckedChange={(checked) => handleChangePermission(permission, checked)} />
                                        <Label>
                                            {t.translate(permission)}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-3">
                            <DialogTrigger>
                                <Button className="rounded-md bg-red-100 text-red-500 hover:bg-red-200">
                                    Cancel
                                </Button>
                            </DialogTrigger>
                            <Button onClick={() => updateUserPermissions(selectedUserDialog.id, selectedUserPerms)} className="rounded-md bg-green-100 text-green-500 hover:bg-green-200">
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}