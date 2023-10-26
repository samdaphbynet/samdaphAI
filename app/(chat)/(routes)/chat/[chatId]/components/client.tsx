"use client"

import {useCompletion} from "ai/react"
import { FormEvent, useState } from "react";
import { Message, Portfolio } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat-header";
import { ChatForm } from "@/components/chat-Form";

interface ChatClientProps {
    portfolio: Portfolio & {
        message: Message[];
        _count: {
            message: number;
        };
    };
};

export const ChatClient = ({
    portfolio
}: ChatClientProps) => {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>(portfolio.message);

    const {
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput
    } = useCompletion({
        api: `/api/chat/${portfolio.id}`,
        onFinish(prompt, completion) {
            const systemMessage = {
                role: 'system',
                content: completion
            };

            setMessages((current) => [...current, systemMessage]);
            setInput("");
            router.refresh();
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage = {
            role: "user",
            content: input
        }

        setMessages((current) => [...current, userMessage]);
        handleSubmit(e);
    }

    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader portfolio={portfolio} />
            <div>
                Chat
            </div>
            <ChatForm 
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}/>
        </div>
    )
}