
export default function Header(){
    return (
        <>
          <header className="w-[43rem] bg-gray-200 text-black mx-auto">
            <nav className="flex justify-between w-full p-4">
              <a href="#"><span className="font-semibold text-xl tracking-tight">AI Chatbot</span></a>
                <div className="md:items-center md:w-auto flex">
                  <div className="flex text-sm" v-else="">
                   <button>Avatar</button>
                  </div>
                </div>
            </nav>
          </header>
        </>
    )
}