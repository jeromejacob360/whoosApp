import Chat from './Chat';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ADD_MESSAGE, DELETE_MESSAGE } from '../store/chatSlice';

//----------------------------------------------//
export default function ChatHistory({ chatHistoryRef }) {
  console.log('ChatHistory RENDERED');
  const dispatch = useDispatch();

  //Access the store
  const chatNames = useSelector((state) => state?.chatState?.chatNames);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );
  const messages = useSelector(
    (state) => state?.chatState?.chats[currentChatName],
  );

  //Side effects
  // loop through each of these chatNames and get all the chats. (No pagination yet)
  useEffect(() => {
    const unsubList = [];
    function scrollToBottom() {
      chatHistoryRef.current &&
        chatHistoryRef.current.scrollTo({
          left: 0,
          top: chatHistoryRef.current.scrollHeight,
          behavior: 'smooth',
        });
    }

    if (chatNames?.length > 0) {
      chatNames.forEach(async (chatName) => {
        const q = collection(db, 'whatsApp/chats', chatName); //TODO setup unsubscribe

        const unsub = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const message = change.doc.data();
              dispatch(ADD_MESSAGE({ chatName, message }));
              scrollToBottom();
            }
            if (change.type === 'modified') {
              const message = change.doc.data();
              dispatch(DELETE_MESSAGE({ chatName, message }));
            }
          });
        });
        unsubList.push(unsub);
      });
    }
    return unsubList.forEach((unsub) => unsub);
  }, [chatHistoryRef, chatNames, dispatch]);

  return (
    <div
      ref={chatHistoryRef}
      className="flex-1 overflow-x-hidden overflow-y-scroll"
    >
      <div className="flex flex-col justify-end">
        {messages &&
          messages.length > 0 &&
          messages.map((message) => {
            return (
              message.time && (
                <Chat
                  chatHistoryRef={chatHistoryRef}
                  key={message.time}
                  message={message}
                />
              )
            );
          })}
      </div>
    </div>
  );
}
