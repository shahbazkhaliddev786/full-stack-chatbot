"use client";
import { useState, FormEvent } from "react";
import { FaArrowUp } from "react-icons/fa6";

interface PromptFormProps {
  chatId: number | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  chatId: number;
}

export default function PromptForm({ chatId, setMessages }: PromptFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sender = "user";

  const handlePrompt = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatId) {
      alert("Create or select a chat first");
      return;
    }
    setIsSubmitting(true);
    const tempId = Date.now();

    const userPrompt: Message = { id: tempId, content, sender, chatId };

    setMessages((prevMessages) => [
      ...prevMessages,
      userPrompt,
      { id: tempId + 1, content: "Loading...", sender: "bot", chatId },
    ]);

    setContent("");

    try {
      const res = await fetch(`http://localhost:3000/api/messages/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPrompt),
      });

      const data = await res.json();
      console.log(data);
      if (data.message && data.message.id && data.botResponse) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.content === "Loading..." && msg.sender === "bot" && msg.chatId === chatId
              ? { id: data.message.id + 1, content: data.botResponse, sender: 'bot', chatId }
              : msg
          )
        );
      } else {
        console.error("Invalid response structure:", data);
      }
      
      setIsSubmitting(false);
      console.log("Form submitted");
    } catch (error) {
      console.error("Error submitting the prompt:", error);
    }
  };
  
  return (
    <>
      <form onSubmit={handlePrompt} className="mt-5">
        <input
          type="search"
          id="default-search"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="block p-4 pl-10 w-full border-none outline-none text-white placeholder-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-50"
          placeholder="Ask your queries"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white absolute right-6 bottom-[2.7rem] bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          <FaArrowUp />
        </button>
      </form>
    </>
  );
}
