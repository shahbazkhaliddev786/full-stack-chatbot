
"use client"
import "../globals.css";
import Header from "../../components/Header";
import PromptForm from "../../components/Form";
import Chats from "../../components/Chats";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

  const { data: session, status } = useSession();
  // let id = session.data?.user.id;

  useEffect(() => {
    const fetchChatsOfUser = async () => {

      if (status === "loading") {
        console.log("Session is loading...");
        return;
      }

      if (!session) {
        console.log("No session found. Redirecting...");
        router.push('/');
        return;
      }

      const id = session.user?.id;
      if (!id) {
        console.log("No user ID found in session.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/chats/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const allChats = data.chats;
        setChats(allChats);

        if (data.length > 0) {
          const chat = data[0];
          setChatId(chat.id);
          const messagesResponse = await fetch(`http://localhost:3000/api/messages/${chat.id}`);
          const initialMessages = await messagesResponse.json();
          setMessages(Array.isArray(initialMessages) ? initialMessages : []);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChatsOfUser();
  }, [router]);


  const createChat = async () => {
    try {
      if (status === "loading") {
        console.log("Session is loading...");
        return;
      }

      if (!session) {
        console.log("No session found. Redirecting...");
        router.push('/');
        return;
      }
      const id = session.user?.id;
      console.log(id);
      const response = await fetch(`http://localhost:3000/api/chats/${id}`, { method: "POST" });
      
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
      toast.error('Chat not deleted');
    }
  };

  const selectChat = async (id: number) => {
    try {
      console.log("Chat selected:", id);
      const response = await fetch(`http://localhost:3000/api/messages/${id}`);
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
      await fetch(`http://localhost:3000/api/chats/${id}`, { method: "DELETE" });
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
      setChats(prevChats => prevChats.filter(chat => chat.id !== id));
      toast.success(`Chat ${id} Deleted Successfully`);
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error('Chat Not Deleted');
    }
  };

  return (
    <main className="h-[100vh] w-[100vw] flex">
       <ToastContainer></ToastContainer>
      <aside className="h-[100vh] flex flex-col bg-gray-200 w-[20vw] border-r-2 border-black">
        <div className="flex shrink-0 px-8 items-center justify-between h-[96px]">
          <h1 className="text-center text-black ml-10">AI Chatbot</h1>
        </div>
        <button onClick={createChat} className="text-black ml-2">Create new chat</button>
        <div className="relative pl-3 my-5 overflow-y-hidden scrollbar-hide overflow-x-hidden">
          <div className="flex flex-col w-full font-medium">
            <Chats chats={chats} selectChat={selectChat} deleteChat={deleteChat} />
          </div>
        </div>
      </aside>
      <section className="w-[80vw] h-[100vh] bg-red-700">
        <header className="bg-gray-200 h-[10vh]">
          <Header />
        </header>
        <div className="h-[70vh] bg-[#f0f1f1] py-10 px-10 overflow-y-auto scrollbar-hide">
          {messages.length === 0 ? (
            <div className="w-full flex justify-center items-center mt-[10rem]">
              <p className="text-black">Hi, Let's chat &#128400;</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`w-full flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-[2rem]`}>
                <div className={`rounded-xl p-4 max-w-[70%] ${message.sender === 'user' ? 'bg-[#d5d5d6]' : 'bg-[#d6d6d6]'}`}>
                  <p className="text-black">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="h-[20vh] bg-gray-200 p-[1rem]">
          <PromptForm chatId={chatId} setMessages={setMessages} />
        </div>
      </section>
    </main>
  );
}
