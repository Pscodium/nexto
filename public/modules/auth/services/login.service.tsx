/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps, useEffect, useState } from 'react';
import { Icons } from "../../../components/icons";
import { Button } from "../../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useNavigate } from 'react-router-dom';
import { authServiceApi } from './auth.service.api';
import { Toaster } from '../../../components/ui/toaster';
import { useToast } from '../../../components/ui/use-toast';
import { useSignInWithGoogle, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../services/firebase.config';


export interface LoginComponentProps extends ComponentProps<'div'> {}

interface InputProps {
    email: string | undefined;
    password: string | undefined;
}

export default function LoginComponent(props: LoginComponentProps) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loader, setLoader] = useState(false);
    const [cantCompleteLogin, setCantCompleteLogin] = useState(false);
    const [completedEmail, setCompletedEmail] = useState(true);
    const [completedPassword, setCompletedPassword] = useState(true);
    const [signInWithGoogle] = useSignInWithGoogle(auth);
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    const [inputs, setInputs] = useState<InputProps>({
        email: undefined,
        password: undefined
    });

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            onClickSubmit();
        }
    }

    function handleChangeEmail(email: string) {
        setInputs({ ...inputs, email: email });
    }

    function handleChangePassword(password: string) {
        setInputs({ ...inputs, password: password });
    }

    async function onClickSubmit() {
        if (!inputs.email && inputs.password) {
            setCompletedEmail(false);
            return;
        }
        if (!inputs.password && inputs.email) {
            setCompletedPassword(false);
            return;
        }
        if (!inputs.email && !inputs.password) {
            setCantCompleteLogin(true);
            return;
        }
        setCantCompleteLogin(false);
        setLoader(true);
        try {
            const res = await authServiceApi.login(inputs.email, inputs.password);
            if (!inputs.email || !inputs.password) {
                return;
            }

            if (res) {
                signInWithEmailAndPassword(inputs.email, inputs.password);
                navigate('/');
                setLoader(false);
            }
        } catch (err: any) {
            setLoader(false);
            setCantCompleteLogin(true);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "User login error. Please try again...",
                className: "outline-none bg-red-600 text-slate-200",
            });
        }
    }

    function onClickRegister() {
        navigate('/register');
    }

    useEffect(() => {
        if (inputs.email) {
            setCompletedEmail(true);
        }
        if (inputs.password) {
            setCompletedPassword(true);
        }
        if (inputs.email && inputs.password) {
            setCantCompleteLogin(false);
        }
    }, [inputs]);

    useEffect(() => {
        if (loading) {
            setLoader(true);
        }
        if (user) {
            navigate('/');
            setLoader(false);
        }
        if (error) {
            // TODO: create a message error for the user
            console.error(error);
        }
    }, [error, loading, user]);

    return (
        <div {...props}>
            <Card className='bg-slate-50 shadow-sm shadow-black/20'>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Enter your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login in your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline">
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                        <Button variant="outline" onClick={() => signInWithGoogle()}>
                            <Icons.google className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className='flex flex-row justify-between'>
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <Input
                            id="email"
                            type="email"
                            className={!completedEmail || cantCompleteLogin ? 'border-red-500' : ''}
                            placeholder="m@example.com"
                            value={inputs.email}
                            onKeyDown={handleKeyPress}
                            onChange={(e) => handleChangeEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className='flex flex-row'>
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className={!completedPassword || cantCompleteLogin ? 'border-red-500' : ''}
                            placeholder='•••••••••••'
                            value={inputs.password}
                            onKeyDown={handleKeyPress}
                            onChange={(e) => handleChangePassword(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={onClickSubmit} className="w-full">Submit</Button>
                </CardFooter>
            </Card>
            <Button className="items-center justify-center flex h-[30px]" onClick={onClickRegister} >
                <Label className="self-center cursor-pointer text-zinc-700 underline">if you don't have an account, create it now</Label>
            </Button>
            {loader ?
                <div className='bg-slate-200/50 h-[100%] w-[100%] absolute top-0 right-0 items-center justify-center flex'>
                    <svg className='loading' viewBox="25 25 50 50">
                        <circle className='circle' cx="50" cy="50" r="20"></circle>
                    </svg>
                </div> : null
            }
            <Toaster />
        </div>
    );
}