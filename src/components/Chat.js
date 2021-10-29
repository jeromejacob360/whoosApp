import { useState } from "react";
import { useSelector } from "react-redux";
import ChatOptions from "./optionMenus/chatOptions";

//----------------------------------------------//
export default function Chat({ message }) {
  console.log("CHAT RENDERED");

  //State variables
  const [openOptions, setOpenOptions] = useState(false);
  //Access the store

  const currentUserName = useSelector((state) => state?.authState?.user?.email);

  //logic
  const messageIsFromMe = message?.from === currentUserName;

  return (
    <div
      className={`flex ${messageIsFromMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-4 group py-1 mx-2 my-4 break-words border-yellow-500 rounded-lg shadow-sm w-52 relative ${
          messageIsFromMe ? "bg-blue-200" : "bg-WaGreen"
        }`}
      >
        <div onClick={() => setOpenOptions(false)}>
          {openOptions && !message.deleted && (
            <ChatOptions message={message} setOpenOptions={setOpenOptions} />
          )}
        </div>
        {!message.deleted && (
          <div className="absolute opacity-0 top-1 right-1 group-hover:opacity-100">
            <svg
              onClick={() => setOpenOptions((prev) => !prev)}
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-icons"
              viewBox="0 0 20 20"
              fill="blue"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div
          className={`${message?.deleted && "text-sm text-gray-600 italic"}`}
        >
          {message?.message}
        </div>
        <p className={`text-xs text-right text-gray-400`}>
          {new Date(message?.time).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
