/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { RegisterProps } from '@/lib/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FloatingLabelInput from '@/components/ui/floating-label';

interface UserDialogProps {
    value: RegisterProps;
    setValue: React.Dispatch<React.SetStateAction<RegisterProps>>;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    createUser: () => Promise<void>;
    loading: boolean;
}

export default function UserRegistrationDialog({ setValue, value, show, createUser, setShow, loading }: UserDialogProps) {
    const [canSave, setCanSave] = useState<boolean>(false);
    const [validPassword, setValidPassword] = useState<boolean>(true);
    const [validEmail, setValidEmail] = useState<boolean>(true);

    useEffect(() => {
        if (
            value.email &&
            value.password &&
            value.nickname &&
            value.firstName &&
            value.lastName &&
            validEmail &&
            validPassword
        ) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [value]);

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    }

    function handleChangeEmail(email: string) {
        setValue({ ...value, email: email });
        if (email === '') {
            setValidEmail(true);
            return;
        }
        setValidEmail(validateEmail(email));
    }

    function handleChangePassword(password: string) {
        setValue({ ...value, password: password });
        if (password === '') {
            setValidPassword(true);
            return;
        }
        setValidPassword(validatePassword(password));
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="bg-white">
                <DialogTitle className="text-[24px]">User Registration</DialogTitle>
                <DialogDescription className="text-[12px] flex flex-col">
                    Create a new user.
                    {!validPassword && (
                        <em className="text-[12px] text-red-500">A minimum 8 characters password contains a combination of <strong>uppercase and lowercase letter</strong> and <strong>number</strong>.</em>
                    )}
                    {!validEmail && (
                        <em className='text-[12px] text-red-500'>Invalid e-mail. <strong>Example: email@email.com</strong></em>
                    )}
                </DialogDescription>
                <div>
                    <form className="py-2 flex flex-col gap-3">
                        <FloatingLabelInput autoComplete='off' text={value?.firstName} onChange={(ev) => setValue({ ...value, firstName: ev.target.value })} label="Nome" type="text" placeholder="Digite seu nome" />
                        <FloatingLabelInput autoComplete='off' text={value?.lastName} onChange={(ev) => setValue({ ...value, lastName: ev.target.value })} label="Sobrenome" type="text" placeholder="Digite seu sobrenome" />
                        <FloatingLabelInput autoComplete='off' text={value?.nickname} onChange={(ev) => setValue({ ...value, nickname: ev.target.value })} label="Nickname" type="text" placeholder="Digite seu nickname" />
                        <FloatingLabelInput invalid={!validEmail} autoComplete='off' text={value?.email} onChange={(ev) => handleChangeEmail(ev.target.value)} label="E-mail" type="email" placeholder="Digite seu e-mail" />
                        <FloatingLabelInput invalid={!validPassword} autoComplete='off' text={value?.password} onChange={(ev) => handleChangePassword(ev.target.value)} label="Senha" type="password" security="*" placeholder="Digite sua senha" />
                    </form>
                </div>
                <div className="flex gap-3">
                    <DialogTrigger>
                        <Button disabled={loading} className="rounded-md bg-red-100 text-red-500 hover:bg-red-200">
                            Cancel
                        </Button>
                    </DialogTrigger>
                    <Button disabled={!canSave || loading} onClick={createUser} className="rounded-md bg-green-100 text-green-500 hover:bg-green-200 disabled:opacity-60 disabled:hover:bg-green-50 disabled:text-green-300">
                        {loading ?
                            <div className='flex items-center text-center justify-center'>
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" stroke='#000' fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                </svg>
                            </div>
                            :
                            "Save"
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}