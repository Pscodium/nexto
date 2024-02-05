import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserProps } from '@/lib/api';


interface UserDialogProps {
    user: UserProps | undefined;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    deleteUser: (userId: number | undefined) => Promise<void>
}

export default function UserDeleteDialog({ user, show, setShow, deleteUser }: UserDialogProps) {
    return (
        <>
            {user && (
                <Dialog open={show} onOpenChange={setShow}>
                    <DialogContent className="bg-white">
                        <DialogTitle className="text-[24px]">User Registration</DialogTitle>
                        <DialogDescription className="text-[18px]">
                            Do you wanna delete <strong>'{user.nickname}({user.id})'</strong> ?
                        </DialogDescription>
                        <div className="flex gap-3">
                            <DialogTrigger>
                                <Button className="rounded-md bg-green-100 text-green-500 hover:bg-green-200">
                                    Cancel
                                </Button>
                            </DialogTrigger>
                            <Button onClick={() => deleteUser(user.id)} className="rounded-md bg-red-100 text-red-500 hover:bg-red-200 disabled:opacity-60 disabled:hover:bg-red-50 disabled:text-red-300">
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}