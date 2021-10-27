import Chat from "./Chat";
import { onSnapshot, doc, query, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  ADD_MESSAGE,
  NEW_USER,
  SET_CHATS,
  UPDATE_MESSAGE,
} from "../store/chatSlice";

export default function ChatHistory() {
  const currentUserName = useSelector((state) => state?.authState?.user?.email);
  const chatNames = useSelector((state) => state?.chatState?.chats?.list);
  const messages = useSelector((state) => state?.chatState?.messages);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName
  );

  const dispatch = useDispatch();

  //get user's chatNames from DB and add it to state
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "whatsApp/users/chatNames", currentUserName),
      (doc) => {
        dispatch(SET_CHATS(doc.data()));
      }
    );
    return unsub;
  }, [currentUserName, dispatch]);

  //loop through each of these chatNames and get all the chats. (No pagination yet)
  useEffect(() => {
    // let subsctiptions = [];
    if (chatNames?.length > 0) {
      chatNames.forEach(async (chatName) => {
        const q = collection(db, "whatsApp/chats", chatName); //TODO setup unsubscribe
        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              dispatch(ADD_MESSAGE({ chatName, message: change.doc.data() }));
            }
            if (change.type === "modified") {
              dispatch(
                UPDATE_MESSAGE({ chatName, newMessage: change.doc.data() })
              );
            }
            if (change.type === "removed") {
            }
          });
        });
        // subsctiptions.push(unsubscribe);
      });
    }
    // return () => subsctiptions.forEach((subsctiption) => subsctiption);
  }, [chatNames, dispatch]);

  useEffect(() => {
    dispatch(NEW_USER());
  }, [currentUserName, dispatch]);

  return (
    <div
      className="overflow-y-scroll"
      style={{ minHeight: "calc(100vh - 106px)" }}
    >
      <div className="flex flex-col justify-end bg-white">
        {messages &&
          currentChatName &&
          messages[currentChatName] &&
          messages[currentChatName].length > 0 &&
          messages[currentChatName].map((message) => {
            return <Chat message={message} />;
          })}
      </div>
    </div>
  );
}
