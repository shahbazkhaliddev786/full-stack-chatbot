import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Chats from "./Chats";

interface Chat {
    createdAt: string,
    id: number
}

interface SidebarProps {
  chats: Chat[];
  createChat: () => void;
  selectChat: (id: number) => void;
  deleteChat: (id: number) => void;
}

export default function Sidebar({ chats, createChat, selectChat, deleteChat }:SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <button
        className="md:hidden p-4  fixed top-0 left-0 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={24}  className="text-black"/> : <AiOutlineMenu className="text-black" size={24} />}
      </button>
      <div
        className={`fixed inset-y-0 bg-gray-200 left-0 z-40 w-64 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:inset-0 bg-gray-200 md:bg-gray-200 flex flex-col`}
      >
        <div className="flex-shrink-0 px-8 py-4 flex items-center justify-between h-24">
          <h1 className="text-center text-black">Chatbot</h1>
        </div>
        <button onClick={createChat} className="text-black ml-2">
          Create new chat
        </button>
        <div className="relative pl-3 my-5 overflow-y-auto scrollbar-hide overflow-x-hidden">
          <Chats chats={chats} selectChat={selectChat} deleteChat={deleteChat} />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0  opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};


