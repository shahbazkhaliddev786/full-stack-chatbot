
"use client";
import "../globals.css";
import Header from "../../components/Header";
import PromptForm from "../../components/Form";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.log(session)
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
        console.log(data);
        console.log(allChats);

        if (allChats.length > 0) {
          const chat = allChats[0];
          setChatId(chat.id);
      
          const messagesResponse = await fetch(`/api/messages/${chat.id}`);
          if (!messagesResponse.ok) {
            throw new Error(`Error fetching messages: ${messagesResponse.statusText}`);
          }
          const initialMessages = await messagesResponse.json();
          setMessages(Array.isArray(initialMessages) ? initialMessages : []);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChatsOfUser();
  }, [router]);

  const createChat = async () => {
    try {
      if (!session) {
        console.log("No session found. Redirecting...");
        router.push("/");
        return;
      }
      const id = session.user?.id;
      const response = await fetch(`/api/chats/${id}`, { method: "POST" });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const res = await response.json();
      setChatId(res.chat.id);
      setMessages(Array.isArray(res.messages) ? res.messages : []);
      setChats((prevChats) => [...prevChats, res.chat]);
      toast.success("Chat created successfully");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Chat not created");

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
      toast.success("Chat Selected");
    } catch (error) {
      console.error("Error selecting chat:", error);
      toast.error("Error selecting chat");
    }
  };

  const deleteChat = async (id: number) => {
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
      toast.success("Chat Deleted");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Chat Not Deleted");
    }
  };

  return (
    <main className="h-screen bg-gray-200 w-screen flex flex-col md:flex-row">
      <ToastContainer />
      <Sidebar
        chats={chats}
        createChat={createChat}
        selectChat={selectChat}
        deleteChat={deleteChat}
      />
      <section className="flex flex-col flex-1 md:w-4/5 h-full bg-red-700">
        <header className="md:block bg-gray-200 h-1/10">
          <Header />
        </header>
        <div className="flex-1 bg-[#f0f1f1] py-10 px-10 overflow-y-auto scrollbar-hide">
           {messages.length === 0 ? (
            <div className="w-full flex justify-center items-center mt-40">
              <p className="text-black">Hi, Let's chat &#128400;</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`w-full flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-8`}
              >
                <div
                  className={`rounded-xl p-4 max-w-4/5 ${
                    message.sender === "user" ? "bg-gray-300" : "bg-gray-400"
                  }`}
                >
                  <p className="text-black">{message.content}</p>
                </div>
              </div>
            ))
          )} 
        </div>
        <div className="bg-gray-200 p-4 w-full fixed bottom-0 md:relative">
          <PromptForm chatId={chatId} setMessages={setMessages} />
        </div>
      </section>
    </main>
  );
}


