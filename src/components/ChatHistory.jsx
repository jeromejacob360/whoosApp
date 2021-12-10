import Chat from './Chat';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useEffect, useState } from 'react';
import {
  ADD_MESSAGE,
  CLEAR_MESSAGE_INFO,
  CLEAR_REPLY_MESSAGE,
  CLEAR_UNREAD_MESSAGES,
  DELETE_MESSAGE,
  FORWARD_MODE_OFF,
  MODIFY_MESSAGE,
} from '../store/chatSlice';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from '../pages/Intro';

//----------------------------------------------//
function ChatHistory({ chatHistoryRef }) {
  console.count('ChatHistory');
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
  const currentUserEmail = useSelector((state) => state?.authState.user?.email);
  const currentUserName = useSelector((state) => state?.authState?.user?.email);

  //turn off forward mode when chat changes
  useEffect(() => {
    dispatch(FORWARD_MODE_OFF());
  }, [currentChatName, dispatch]);

  //clear message info tab when chat changes
  useEffect(() => {
    dispatch(CLEAR_MESSAGE_INFO());
  }, [dispatch, currentChatName]);

  // clear unread messages when chat is opened
  useEffect(() => {
    dispatch(CLEAR_UNREAD_MESSAGES());
  }, [dispatch, currentChatterEmail]);

  //scroll to bottom when chat is opened

  useEffect(() => {
    setTimeout(() => {
      if (chatHistoryRef.current)
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }, 0);
  }, [chatHistoryRef, currentChatName]);

  //clear reply message when chat is changed
  useEffect(() => {
    dispatch(CLEAR_REPLY_MESSAGE());
  }, [dispatch, currentChatName]);

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
        const q = query(
          collection(db, 'whatsApp/chats', chatName),
          // prevent reading flag as that will add to unread messages count
          where('from', '>=', ''), //TODO limit this to last say, 50
        );

        const unsub = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const message = change.doc.data();
              dispatch(
                ADD_MESSAGE({
                  chatName,
                  message,
                  currentUserEmail,
                  from: 'server',
                }),
              );
              if (
                message.from === currentUserEmail &&
                (!message.status || message.status === 'sent')
              ) {
              }
            }
            if (change.type === 'modified') {
              const message = change.doc.data();
              dispatch(MODIFY_MESSAGE({ chatName, message }));
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

    return unsubList.forEach((unsub) => unsub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatNames, currentUserEmail, dispatch]);

  return currentChatName ? (
    <div
      ref={chatHistoryRef}
      className="relative flex-1 h-full px-4 overflow-x-hidden overflow-y-scroll duration-500 scrollbar hover:scrollbar-thumb-blue-400 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-blue-50"
    >
      {addOptionsToSaveContact && (
        <div className="flex p-4 space-x-4 bg-white shadow-sm">
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
      <ul className="flex flex-col justify-end py-2">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => {
            return (
              <AnimatePresence key={message.time}>
                {!message?.deletedForMe.includes(currentUserName)
                  ? message.time && (
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Chat
                          nextSender={
                            messages[index + 1] && messages[index + 1].from
                          }
                          prevSender={
                            messages[index - 1] && messages[index - 1].from
                          }
                          chatHistoryRef={chatHistoryRef}
                          message={message}
                        />
                      </motion.li>
                    )
                  : null}
              </AnimatePresence>
            );
          })}
      </ul>
    </div>
  ) : (
    <Intro />
  );
}

export default memo(ChatHistory);
ChatHistory.wdyr = true;
