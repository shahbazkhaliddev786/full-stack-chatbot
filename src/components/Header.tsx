import { signOut } from "next-auth/react";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Header() {
  const router = useRouter();

  // sign out functionality
  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>)=>{
    try {
      await signOut();
      toast.success("Sign out successful");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Error is sign out");
    }
  }

  return (
    <>
      <header className="w-full bg-gray-200 text-black">
        <ToastContainer></ToastContainer>
        <nav className="flex justify-between items-center max-w-7xl mx-auto p-4">
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <span className="font-semibold text-xl tracking-tight">Chatbot</span>
          </div>
          <div className="hidden md:flex items-center">
            <button className="text-sm" onClick={handleSignOut}>Sign out</button>
          </div>
        </nav>
      </header>
    </>
  );
}
