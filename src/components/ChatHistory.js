import Chat from "./Chat";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { ADD_MESSAGE, CHAT_HISTORY_REF } from "../store/chatSlice";

//----------------------------------------------//
export default function ChatHistory() {
  console.log("CHAT_HISTORY RENDERED");
  const dispatch = useDispatch();
  const chatHistoryRef = useRef();

  useEffect(() => {
    if (chatHistoryRef.current)
      dispatch(CHAT_HISTORY_REF(chatHistoryRef.current));
  });

  //Access the store
  const chatNames = useSelector((state) => state?.chatState?.chatNames);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName
  );
  const messages = useSelector(
    (state) => state?.chatState?.chats[currentChatName]
  );

  //Side effects
  // loop through each of these chatNames and get all the chats. (No pagination yet)
  useEffect(() => {
    if (chatNames?.length > 0) {
      chatNames.forEach(async (chatName) => {
        const q = collection(db, "whatsApp/chats", chatName); //TODO setup unsubscribe
        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const message = change.doc.data();
              dispatch(ADD_MESSAGE({ chatName, message }));
            }
            chatHistoryRef.current &&
              chatHistoryRef.current.scrollTo({
                left: 0,
                top: chatHistoryRef.current.scrollHeight,
                behavior: "smooth",
              });
          });
        });
      });
    }
  }, [chatNames, dispatch]);

  return (
    <div
      ref={chatHistoryRef}
      className="overflow-y-scroll"
      style={{ minHeight: "calc(100vh - 106px)" }}
    >
      <div className="flex flex-col justify-end bg-white">
        {messages &&
          messages.length > 0 &&
          messages.map((message) => {
            return <Chat message={message} />;
          })}
      </div>
    </div>
  );
}
