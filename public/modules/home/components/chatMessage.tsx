/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { auth } from "../../../services/firebase.config";
import moment from 'moment';

interface ChatMessageProps {
    message: MessageProps
}

export interface MessageProps {
    text: string;
    name: string;
    photoURL: string;
    consecutive: boolean;
    uid: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    }
}

export default function ChatMessage(props: ChatMessageProps) {
    const { text, photoURL, uid, createdAt, name, consecutive } = props.message;
    const sender = uid === auth.currentUser?.uid;
    const recipientMessage = `ml-2 py-3 px-4 bg-gray-400 ${consecutive? 'rounded-3xl' : 'rounded-br-3xl'} rounded-tr-3xl ${consecutive? 'rounded-tl-xl':'rounded-bl-xl'} text-white`;
    const senderMessage = `mr-2 py-3 px-4 bg-blue-400 ${consecutive? 'rounded-3xl' : 'rounded-bl-3xl'} rounded-tl-3xl ${consecutive? 'rounded-tr-xl':'rounded-br-xl'} text-white`;



    function formattedDate(seconds: number) {
        let formattedData;
        const secondsToDate = moment.unix(seconds);

        const now = moment();

        if (secondsToDate.isSame(now, 'day')) {
            formattedData = secondsToDate.format('HH:mm');
        } else if (secondsToDate.isSame(now.clone().subtract(1, 'days'), 'day')) {
            formattedData = `ontem às ${secondsToDate.format('HH:mm')}`;
        } else {
            formattedData = secondsToDate.format('DD/MM/YYYY HH:mm');
        }

        return formattedData;
    }

    return (
        <div className={sender? "flex flex-row-reverse justify-start mb-4 m-4" : "flex flex-row justify-start mb-4 m-4"}>
            <img
                src='https://source.unsplash.com/vpOeXr5wmR4/600x600'
                className={consecutive? 'object-cover h-8 w-8 opacity-0' : "object-cover h-8 w-8 rounded-full"}
                alt=""
            />
            <div className="">

                <div
                    className={sender? senderMessage : recipientMessage}
                >
                    <p className="text-[9px]">{sender || consecutive? '' : name}</p>
                    {text}
                    {createdAt &&
                        <p className="text-[9px] justify-end">{formattedDate(createdAt.seconds)}</p>
                    }
                </div>
            </div>
        </div>

    );
}