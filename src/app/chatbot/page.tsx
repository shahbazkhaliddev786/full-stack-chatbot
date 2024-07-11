
"use client"
import "../globals.css";
import Header from "../../components/Header";
import PromptForm from "../../components/Form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from "@/components/Sidebar";

interface Chat {
  id: number;
  createdAt: string;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  chatId: number;
}

export default function Chatbot() {
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const fetchChatsOfUser = async () => {
      if (!session) {
        return;
      }

      const id = session.user?.id;
      console.log(id);
      console.log(session);
      if (!id) {
        console.log("No user ID found in session.");
        return;
      }
      try {
        const response = await fetch(`/api/chats/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const allChats = data.chats;
        setChats(allChats);

        if (data.length > 0) {
          const chat = data[0];
          setChatId(chat.id);
          const messagesResponse = await fetch(`/api/messages/${chat.id}`);
          const initialMessages = await messagesResponse.json();
          setMessages(Array.isArray(initialMessages) ? initialMessages : []);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChatsOfUser();
  }, [router, session]);

  const createChat = async () => {
    try {
      if (!session) {
        return;
      }
      const id = session.user?.id;
      console.log(id);
      const response = await fetch(`/api/chats/${id}`, { method: "POST" });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const res = await response.json();
      setChatId(res.chat.id);
      setMessages(Array.isArray(res.messages) ? res.messages : []);
      setChats(prevChats => [...prevChats, res.chat]);
      toast.success('Chat created successfully');
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Chat not created');
    }
  };

  const selectChat = async (id: number) => {
    try {
      console.log("Chat selected:", id);
      const response = await fetch(`/api/messages/${id}`);
      const messages: Message[] = await response.json();
      setChatId(id);
      setMessages(Array.isArray(messages) ? messages : []);
      toast.success('Chat Selected');
    } catch (error) {
      console.error('Error selecting chat:', error);
      toast.error('Error selecting chat');
    }
  };

  const deleteChat = async (id: number) => {
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
      setChats(prevChats => prevChats.filter(chat => chat.id !== id));
      toast.success(`Chat Deleted Successfully`);
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error('Chat Not Deleted');
    }
  };

  return (
    <main className="h-screen w-screen flex">
      <Toaster />
      <div className="bg-gray-200 flex-shrink-0">
        <Sidebar chats={chats} createChat={createChat} selectChat={selectChat} deleteChat={deleteChat} />
      </div>
      <section className="flex-1 h-full bg-red-700 flex flex-col">
        <header className="bg-gray-200 h-1/10">
          <Header />
        </header>
        <div className="flex-1 bg-[#f0f1f1] py-10 px-10 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="w-full flex justify-center items-center mt-40">
              <p className="text-black">Hi, Let's chat &#128400;</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`w-full flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-8`}>
                <div className={`rounded-xl p-4 max-w-[70%] ${message.sender === 'user' ? 'bg-[#d5d5d6]' : 'bg-[#d6d6d6]'}`}>
                  <p className="text-black">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="h-2/10 bg-gray-200 p-4">
          <PromptForm chatId={chatId} setMessages={setMessages} />
        </div>
      </section>
    </main>
  );
}

