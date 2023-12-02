/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Card } from '../../components/ui/card';
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { IoIosLogOut, IoMdSend } from 'react-icons/io';
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, databaseApp } from "../../services/firebase.config";
import { TailSpin } from 'react-loader-spinner';
import { collection, limit, orderBy, query } from "firebase/firestore";
import ChatMessage, { MessageProps } from './components/chatMessage';
import { InvalidBearerToken, UserProps, api } from "../../lib/api";
import { chatService } from './services/chat.service.api';

export default function Home() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const [signOut, loading] = useSignOut(auth);
    const [reqUser, setReqUser] = useState<UserProps>();
    const [text, setText] = useState('');
    const dummy = useRef<HTMLDivElement>(null);
    const messageRef = collection(databaseApp, "messages");
    const queryMessages = query(messageRef, orderBy("createdAt"), limit(25));
    const [messages] = useCollectionData<MessageProps>(queryMessages);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        dummy.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function getUser() {
        try {
            const res = await api.getUserData();
            if (res) {
                setReqUser(res);
            }
        } catch (err) {
            if (err instanceof InvalidBearerToken) {
                navigate('/login');
            }
            console.error(err);
        }
    }

    async function logout() {
        try {
            const success = await signOut();
            if (success) {
                navigate('/login');
                await api.logout();
            }

        } catch (err) {
            console.error(err);
        }
    }

    function isLastSender(uid: string) {
        if (!uid || !messages) {
            return;
        }
        if (messages.length < 1) {
            return false;
        }
        const lastUidSender = messages[messages.length - 1].uid;

        return uid === lastUidSender;
    }

    const sendMessage = async () => {
        if (!auth.currentUser || !reqUser) {
            return;
        }
        const { photoURL, uid } = auth.currentUser;
        let consecutive = isLastSender(uid);
        if (!consecutive) {
            consecutive = false;
        }
        await chatService.sendMessage({
            consecutive: consecutive,
            text: text,
            uid: uid
        });
        setText('');
        dummy.current?.scrollIntoView({ behavior: "smooth" });
    };

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div>
            {user || loading ?
                <div className="flex flex-col justify-center align-middle items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black min-h-screen">
                    <Card className='w-[70vw] h-[70vh] rounded-xl overflow-hidden bg-slate-700 border-slate-700 relative'>
                        <div className="flex flex-col justify-between h-full w-full">
                            <div className="h-full w-full overflow-x-hidden pb-[50px]">
                                <>
                                    <main>
                                        {messages &&
                                            <>
                                                {messages.map((msg, index) => (
                                                    <ChatMessage key={index} message={msg} />
                                                ))}
                                                <div ref={dummy}></div>
                                            </>

                                        }
                                    </main>
                                </>
                            </div>
                            <div className="flex w-full absolute bottom-0 py-2 items-center justify-evenly bg-slate-700">
                                <Input onKeyDown={handleKeyPress} value={text} onChange={(e) => setText(e.target.value)} className="w-[64vw] h-[50px] rounded-full text-slate-100" type="text" placeholder="Digite sua mensagem..." />
                                <Button onClick={() => {
                                    text != "" ? sendMessage() : null;
                                }} className="bg-slate-500 hover:bg-slate-400 rounded-full w-[50px] h-[50px]" type="submit">
                                    <IoMdSend className="h-[20px] w-[20px] fill-[#2c2a2a]" />
                                </Button>
                            </div>
                        </div>
                    </Card >
                    <button onClick={logout} className="h-[50px] w-[50px] flex items-center justify-center absolute bottom-1 hover:bg-zinc-200 top-5 right-5 bg-slate-900 rounded-xl">
                        <IoIosLogOut className="h-[20px] w-[20px] fill-[#A4A4A4]" />
                    </button>
                </div >
                :
                <div className="flex flex-col justify-center align-middle items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black min-h-screen">
                    <TailSpin
                        height="80"
                        width="80"
                        color="#fff"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            }
        </div>

    );
}