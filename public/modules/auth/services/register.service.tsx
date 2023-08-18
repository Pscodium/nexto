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
import { BiArrowBack } from 'react-icons/bi';
import { authServiceApi } from './auth.service.api';
import '../css/loading.css';

export interface RegisterComponentProps extends ComponentProps<'div'> { }

interface InputsProps {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

export default function RegisterComponent(props: RegisterComponentProps) {

    const [firstStep, setFirstStep] = useState(true);
    const [cantPassStep, setCantPassStep] = useState(false);
    const [completedEmail, setCompletedEmail] = useState(false);
    const [completedPassword, setCompletedPassword] = useState(false);
    const [completedFirstName, setCompletedFirstName] = useState(false);
    const [completedLastName, setCompletedLastName] = useState(false);
    const [cantCompletedRegistration, setCantCompletedRegistration] = useState(false);
    const [loading, setLoading] = useState(false);

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const [inputs, setInputs] = useState<InputsProps>({
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

        if (inputs.firstName) {
            setCompletedFirstName(true);
        }

        if (inputs.lastName) {
            setCompletedLastName(true);
        }

        if (inputs.firstName && inputs.lastName) {
            setCantCompletedRegistration(false);
        }
    }, [inputs]);

    useEffect(() => {
        setCompletedPassword(true);
        setCompletedEmail(true);
        setCompletedFirstName(true);
        setCompletedLastName(true);
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
        if (!inputs.firstName && inputs.lastName) {
            setCompletedFirstName(false);
            return;
        }
        if (!inputs.lastName && inputs.firstName) {
            setCompletedLastName(false);
            return;
        }
        if (!inputs.firstName && !inputs.lastName) {
            setCantCompletedRegistration(true);
            return;
        }
        setCantCompletedRegistration(false);
        setLoading(true);
        const response = await authServiceApi.register({
            email: inputs.email,
            password: inputs.password,
            firstName: inputs.firstName,
            lastName: inputs.lastName
        });
        if (response) {
            window.location.href = '/login';
            setLoading(false);
            // Complete registration
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

    return (
        <>
            <div {...props}>
                {firstStep ?
                    <Card className='bg-slate-50 shadow-sm shadow-black/20'>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl">Create an account</CardTitle>
                            <CardDescription>
                                Enter your email below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline">
                                    <Icons.gitHub className="mr-2 h-4 w-4" />
                                    Github
                                </Button>
                                <Button variant="outline">
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
                    :
                    <>
                        {loading?
                            <div className='bg-slate-200/50 h-[100%] w-[100%] absolute top-0 right-0 items-center justify-center flex'>
                                <svg className='loading' viewBox="25 25 50 50">
                                    <circle className='circle' cx="50" cy="50" r="20"></circle>
                                </svg>
                            </div>: null
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
                                    <Label htmlFor="email">First Name</Label>
                                    <Input
                                        id="email"
                                        className={!completedFirstName || cantCompletedRegistration ? 'border-red-500' : ''}
                                        type="text"
                                        placeholder="Your name"
                                        value={inputs.firstName}
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
            </div>
        </>
    );
}