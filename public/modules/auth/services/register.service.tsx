import React, { ComponentProps, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { authServiceApi } from './auth.service.api';
import '../css/loading.css';

export interface RegisterComponentProps extends ComponentProps<'div'> { }

interface InputsProps {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    nickname: string | undefined;
}

export default function RegisterComponent(props: RegisterComponentProps) {

    const { toast } = useToast();
    const navigate = useNavigate();
    const [firstStep, setFirstStep] = useState(true);
    const [cantPassStep, setCantPassStep] = useState(false);
    const [completedEmail, setCompletedEmail] = useState(false);
    const [completedPassword, setCompletedPassword] = useState(false);
    const [completedFirstName, setCompletedFirstName] = useState(false);
    const [completedLastName, setCompletedLastName] = useState(false);
    const [completedNickname, setCompletedNickname] = useState(false);
    const [cantCompletedRegistration, setCantCompletedRegistration] = useState(false);
    const [loader, setLoader] = useState(false);

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const [inputs, setInputs] = useState<InputsProps>({
        nickname: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined
    });

    useEffect(() => {
        if (inputs.email) {
            setCompletedEmail(true);
        }
        if (inputs.password) {
            setCompletedPassword(true);
        }
        if (inputs.email && inputs.password) {
            setCantPassStep(false);
        }

        if (inputs.nickname) {
            setCompletedNickname(true);
        }

        if (inputs.firstName) {
            setCompletedFirstName(true);
        }

        if (inputs.lastName) {
            setCompletedLastName(true);
        }

        if (inputs.firstName && inputs.lastName && inputs.nickname) {
            setCantCompletedRegistration(false);
        }
    }, [inputs]);

    useEffect(() => {
        setCompletedPassword(true);
        setCompletedEmail(true);
        setCompletedFirstName(true);
        setCompletedLastName(true);
        setCompletedNickname(true);
    }, []);


    function onClickSubmit() {

        if (!emailValid) {
            setCompletedEmail(false);
            setFirstStep(true);
            return;
        }

        if (!passwordValid) {
            setCompletedPassword(false);
            setFirstStep(true);
            return;
        }

        if (!inputs.email && inputs.password) {
            setCompletedEmail(false);
            setFirstStep(true);
            return;
        }

        if (!inputs.password && inputs.email) {
            setCompletedPassword(false);
            setFirstStep(true);
            return;
        }

        if (!inputs.email && !inputs.password) {
            setFirstStep(true);
            setCantPassStep(true);
            return;
        }
        setCantPassStep(false);
        setFirstStep(false);
    }

    async function onCompleteRegistration() {
        if (!inputs.firstName && inputs.lastName && inputs.nickname) {
            setCompletedFirstName(false);
            return;
        }
        if (!inputs.lastName && inputs.firstName && inputs.nickname) {
            setCompletedLastName(false);
            return;
        }
        if (!inputs.nickname && inputs.firstName && inputs.lastName) {
            setCompletedNickname(false);
            return;
        }
        if (!inputs.firstName || !inputs.lastName || !inputs.nickname) {
            setCantCompletedRegistration(true);
            return;
        }
        setCantCompletedRegistration(false);
        setLoader(true);
        try {
            const response = await authServiceApi.register({
                email: inputs.email,
                password: inputs.password,
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                nickname: inputs.nickname
            });
            if (response) {
                navigate('/login');
                setLoader(false);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setLoader(false);
            if (err.response.status === 409) {
                setCompletedEmail(false);
                setFirstStep(true);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Email already in use",
                    className: "outline-none bg-red-600 text-slate-200",
                });
                return;
            }
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Unexpected error on registration. Please try again...",
                className: "outline-none bg-red-600 text-slate-200",
            });
            console.error(err);
        }
    }

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    }

    function handleChangeEmail(email: string) {
        setInputs({ ...inputs, email: email });
        if (email === '') {
            setCompletedEmail(true);
            setEmailValid(true);
            return;
        }
        setEmailValid(validateEmail(email));
    }

    function handleChangePassword(password: string) {
        setInputs({ ...inputs, password: password });
        if (password === '') {
            setCompletedPassword(true);
            setPasswordValid(true);
            return;
        }
        setPasswordValid(validatePassword(password));
    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!firstStep && event.key === 'Enter') {
            onCompleteRegistration();
        }

        if (event.key === 'Enter') {
            onClickSubmit();
        }

    }

    function onClickLogin() {
        navigate('/login');
    }

    return (
        <>
            <div {...props}>
                {firstStep ?
                    <>
                        <Card className='bg-slate-50 shadow-sm shadow-black/20'>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                                <CardDescription>
                                    Enter your email and password to create a new account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <div className='flex flex-row justify-between'>
                                        <Label htmlFor="email">Email</Label>
                                        {!emailValid && (
                                            <Label className='text-red-500 text-xs'>Enter a valid email address</Label>
                                        )}
                                    </div>
                                    <Input
                                        id="email"
                                        className={!completedEmail || cantPassStep || !emailValid ? 'border-red-500' : ''}
                                        type="email"
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
                                        className={!completedPassword || cantPassStep || !passwordValid ? 'border-red-500' : ''}
                                        type="password"
                                        placeholder='•••••••••••'
                                        value={inputs.password}
                                        onKeyDown={handleKeyPress}
                                        onChange={(e) => handleChangePassword(e.target.value)}
                                    />
                                    {!passwordValid && (
                                        <Label className='text-red-500 text-xs'>Must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character</Label>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={onClickSubmit} className="w-full">Continue Registration</Button>
                            </CardFooter>
                        </Card>
                        <Toaster />
                    </>
                    :
                    <>
                        {loader ?
                            <div className='bg-slate-200/50 h-[100%] w-[100%] absolute top-0 right-0 items-center justify-center flex'>
                                <svg className='loading' viewBox="25 25 50 50">
                                    <circle className='circle' cx="50" cy="50" r="20"></circle>
                                </svg>
                            </div> : null
                        }

                        <Card className='w-[100%] bg-slate-50 shadow-sm shadow-black/20'>

                            <CardHeader className="space-y-1">
                                <div className='min-w-[100%]'>
                                    <Button onClick={() => setFirstStep(true)}>
                                        <BiArrowBack />
                                    </Button>
                                </div>
                                <CardTitle className="text-2xl">Create an account</CardTitle>
                                <CardDescription>
                                    Continue your account registration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Nickname</Label>
                                    <Input
                                        id="email"
                                        className={!completedNickname || cantCompletedRegistration ? 'border-red-500' : ''}
                                        type="text"
                                        placeholder="Your nickname"
                                        value={inputs.nickname}
                                        onKeyDown={handleKeyPress}
                                        onChange={(e) => setInputs({ ...inputs, nickname: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">First Name</Label>
                                    <Input
                                        id="email"
                                        className={!completedFirstName || cantCompletedRegistration ? 'border-red-500' : ''}
                                        type="text"
                                        placeholder="Your name"
                                        value={inputs.firstName}
                                        onKeyDown={handleKeyPress}
                                        onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Last Name</Label>
                                    <Input
                                        id="email"
                                        className={!completedLastName || cantCompletedRegistration ? 'border-red-500' : ''}
                                        type="text"
                                        placeholder='Your last name'
                                        value={inputs.lastName}
                                        onKeyDown={handleKeyPress}
                                        onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={onCompleteRegistration} className="w-full">Create account</Button>
                            </CardFooter>
                        </Card>
                    </>
                }
                <Button className="items-center justify-center flex h-[30px]" onClick={onClickLogin}>
                    <Label className="self-center cursor-pointer text-zinc-700 underline">if you already have an account, login</Label>
                </Button>
            </div>
        </>
    );
}