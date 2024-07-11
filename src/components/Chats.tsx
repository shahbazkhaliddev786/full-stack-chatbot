
import { MdDelete } from "react-icons/md";

interface Chat {
    createdAt: string,
    id: number
}

interface ChatProps {
    chats: Chat[];
    selectChat: (id: number) => void;
    deleteChat: (id: number) => void;
}

export default function Chats({ chats, selectChat, deleteChat }: ChatProps) {
    
    return (
        <div>
           <div className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-10rem)]">
           {chats.length > 0 ? (
                chats.map((chat) => (
                    <div key={chat.id} >
                        <p
                            className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]"
                            onClick={() => selectChat(chat.id)}
                        >
                            <span className="flex items-center flex-grow text-[1.15rem] dark:text-neutral-400/75 hover:text-dark ">
                            {
                                chat.createdAt
                            }
                            </span>
                            <button onClick={()=> deleteChat(chat.id)} className="text-black mt-4"><MdDelete /></button>
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-black">No chats available.</p>
            )}
           </div>
        </div>
    );
}
