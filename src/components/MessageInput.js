import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

//----------------------------------------------//
export default function MessageInput() {
  console.log("MESSAGEINPUT RENDERED");

  //State variables
  const [message, setMessage] = useState("");
  const inputRef = useRef();

  //Access the store
  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName
  );
  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);
  const chatHistoryRef = useSelector(
    (state) => state?.chatState.chatHistoryRef
  );

  //Side effects
  useEffect(() => {
    inputRef.current.focus();
  }, [currentChatName]);

  async function sendMessage(e) {
    let newMessage;
    e.preventDefault();
    if (message) {
      newMessage = {
        time: Date.now(),
        message,
        from: currentUserName,
        to: currentChatterEmail,
      };
      setMessage("");

      try {
        await setDoc(
          doc(
            db,
            "whatsApp/chats",
            currentChatName,
            newMessage.time.toString()
          ),
          newMessage
        );
        chatHistoryRef.scrollTo({
          left: 0,
          top: chatHistoryRef.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        console.log(`error.message`, error.message);
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={sendMessage}
        className="flex px-4 py-2 border shadow-md bg-main "
      >
        <input
          ref={inputRef}
          disabled={!currentChatName}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 rounded-full disabled:cursor-not-allowed"
          placeholder="Type a message.."
          type="text"
        />
        <button
          type="submit"
          disabled={!currentChatName}
          className="px-3 py-1 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
