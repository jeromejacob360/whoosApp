import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { doc, setDoc, getDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const inputRef = useRef();
  const currentChatName = useSelector(
    (state) => state?.chatState.currentChatName
  );
  const currentChatterName = useSelector(
    (state) => state?.chatState.currentChatterName
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);

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

        const currentUserRef = doc(
          db,
          "whatsApp/users/chatNames",
          currentUserName
        );
        const userDocSnap = await getDoc(currentUserRef);

        if (userDocSnap.exists()) {
          await updateDoc(currentUserRef, {
            list: arrayUnion(currentChatName),
          });
        } else {
          await setDoc(currentUserRef, {
            list: [currentChatName],
          });
        }
        const currentChatterRef = doc(
          db,
          "whatsApp/users/chatNames",
          currentChatterName
        );
        const chattererDocSnap = await getDoc(currentUserRef);

        if (chattererDocSnap.exists()) {
          await updateDoc(currentChatterRef, {
            list: arrayUnion(currentChatName),
          });
        } else {
          await setDoc(currentChatterRef, {
            list: [currentChatName],
          });
        }
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
