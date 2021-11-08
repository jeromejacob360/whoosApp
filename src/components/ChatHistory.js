import Chat from './Chat';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  ADD_MESSAGE,
  CLEAR_UNREAD_MESSAGES,
  DELETE_MESSAGE,
} from '../store/chatSlice';

//----------------------------------------------//
export default function ChatHistory({ chatHistoryRef }) {
  const [addOptionsToSaveContact, setAddOptionsToSaveContact] = useState(false);

  const dispatch = useDispatch();

  //Access the store
  const chatNames = useSelector((state) => state?.chatState?.chatNames);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );
  const messages = useSelector(
    (state) => state?.chatState?.chats[currentChatName],
  );
  const namelessChats = useSelector((state) => state?.chatState?.namelessChats);
  const currentChatterEmail = useSelector(
    (state) => state?.chatState?.currentChatterEmail,
  );

  // clear unread messages when chat is opened
  useEffect(() => {
    dispatch(CLEAR_UNREAD_MESSAGES());
  }, [dispatch, currentChatterEmail]);

  useEffect(() => {
    if (namelessChats.includes(currentChatName)) {
      setAddOptionsToSaveContact(true);
    } else {
      setAddOptionsToSaveContact(false);
    }
  }, [currentChatName, namelessChats]);

  //Side effects
  // loop through each of these chatNames and get all the chats. (No pagination yet)
  useEffect(() => {
    const unsubList = [];

    if (chatNames?.length > 0) {
      chatNames.forEach(async (chatName) => {
        const q = collection(db, 'whatsApp/chats', chatName);

        const unsub = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const message = change.doc.data();
              dispatch(ADD_MESSAGE({ chatName, message }));
              scrollToBottom();
            }
            if (change.type === 'removed') {
              const message = change.doc.data();
              dispatch(DELETE_MESSAGE({ chatName, message }));
            }
          });
        });
        unsubList.push(unsub);
      });
    }

    function scrollToBottom() {
      chatHistoryRef.current &&
        chatHistoryRef.current.scrollTo({
          left: 0,
          top: chatHistoryRef.current.scrollHeight,
          behavior: 'smooth',
        });
    }

    return unsubList.forEach((unsub) => unsub);
  }, [chatHistoryRef, chatNames, dispatch]);

  //logic

  return (
    <div
      ref={chatHistoryRef}
      className="flex-1 overflow-x-hidden overflow-y-scroll"
    >
      {addOptionsToSaveContact && (
        <div className="flex p-4 space-x-4 shadow-sm bg-dim">
          <button className="px-4 py-1 text-white bg-blue-500 rounded-md">
            <a
              target="_blank"
              href={`${process.env.REACT_APP_contactsRedirectUrl}/person/edit/${currentChatterEmail}`}
              rel="noreferrer"
            >
              Add to contacts
            </a>
          </button>
          <button className="px-4 py-1 text-white bg-yellow-700 rounded-md">
            Block
          </button>
        </div>
      )}
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
