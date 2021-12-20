import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator } from '../helper-functions/formatters';
import {
  NAMELESS_CHAT,
  PAGE_RENDERED,
  REMOVE_NAMELESS_CHAT,
  SET_CURRENT_CHAT,
} from '../store/chatSlice';
import noAvatar from '../assets/images/no_avatar.png';
import { memo, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';
import { AnimatePresence, motion } from 'framer-motion';
import MessageStats from '../minor-components/MessageStats';
import { BsCardImage } from 'react-icons/bs';

//----------------------------------------------//
function Contact({ contact, setOpenContacts }) {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(PAGE_RENDERED());
    }, 1000);
  }, [dispatch]);

  const [contactHasName, setContactHasName] = useState(true);
  const [chatOpened, setChatOpened] = useState(false);
  const [contactName, setContactName] = useState('');

  //Access the store
  const currentUserEmail = useSelector((state) => state?.authState.user.email);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );
  const windowWidth = useSelector((state) => state?.chatState.windowWidth);
  const chatName = chatNameGenerator(contact.email, currentUserEmail);
  const unreadMessagecount = useSelector(
    (state) => state?.chatState?.unreadMessages[chatName],
  );

  const thisChat = useSelector((state) => state?.chatState?.chats[chatName]);
  const lastMessage = thisChat?.[thisChat.length - 1];

  //Check if the contact has a name
  useEffect(() => {
    setContactHasName(!!(contact.firstName || contact.surname));
  }, [contact]);

  useEffect(() => {
    if (contact && !contactHasName) {
      async function findThisContactInUsersContacts(email) {
        const snap = await getDoc(
          doc(db, 'contactsApp/userContacts', currentUserEmail, email),
        );
        if (snap.exists()) {
          const contact = snap.data();
          await setDoc(
            doc(db, 'whatsApp/userContacts', currentUserEmail, email),
            contact,
          );
        }
      }
      findThisContactInUsersContacts(contact.email);
    }
  }, [contact, contactHasName, currentUserEmail]);

  useEffect(() => {
    if (contactHasName === false) {
      dispatch(NAMELESS_CHAT(chatName));
    } else {
      dispatch(REMOVE_NAMELESS_CHAT(chatName));
    }
  }, [contactHasName, chatName, dispatch]);

  useEffect(() => {
    const contactName = contactHasName
      ? `${contact.firstName} ${contact.surname ? contact.surname : ''}`
      : contact.email;

    setContactName(contactName);
  }, [contactHasName, contact]);

  function setChat() {
    setChatOpened(true);
    dispatch(
      SET_CURRENT_CHAT({
        currentUserEmail,
        currentChatterEmail: contact.email,
        senderName: contactName,
        avatar: contact.imageURL || noAvatar,
      }),
    );
  }

  if (!contact) return null;
  return (
    <div
      className={`relative flex items-center px-3 duration-100 w-full cursor-pointer ${
        windowWidth > 640 && currentChatName === chatName
          ? 'bg-blue-300 transform scale-x-105 shadow-md rounded-xl'
          : 'bg-blue-50 hover:bg-blue-100 border-b'
      }`}
      onClick={() => {
        setChat();
        setOpenContacts && setOpenContacts(false);
      }}
    >
      <div className="mr-3 min-w-max">
        <img
          className="object-cover w-12 h-12 rounded-xl"
          src={contact.imageURL || noAvatar}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start justify-center w-full px-2 h-18">
        {!contactHasName && !chatOpened && (
          <div className="absolute text-xs text-red-600 top-1 right-6">
            New!
          </div>
        )}
        <div className="flex items-center justify-between w-full">
          <div>
            <h4
              className={`whitespace-nowrap ${
                contactHasName ? '' : 'text-blue-800'
              } ${unreadMessagecount > 0 ? 'text-gray-900' : 'text-gray-600'}`}
            >
              {contactName}
            </h4>
            <div className="relative flex items-center">
              <div className="absolute left-0">
                {lastMessage && (
                  <MessageStats
                    messageObj={lastMessage}
                    messageIsFromMe={lastMessage.from === currentUserEmail}
                  />
                )}
              </div>
              {lastMessage && (
                <p className="px-5">
                  {lastMessage.message ? (
                    lastMessage.message
                  ) : lastMessage.mediaUrl ? (
                    <BsCardImage size={25} />
                  ) : (
                    ''
                  )}
                </p>
              )}
            </div>
          </div>

          <motion.div className="flex flex-col items-end">
            <motion.p className="text-xs text-black lowercase whitespace-nowrap">
              {lastMessage?.time &&
                new Date(lastMessage?.time).toLocaleTimeString()}
            </motion.p>
            <AnimatePresence>
              {unreadMessagecount > 0 && (
                <motion.span
                  className={`text-sm text-black pt-2 flex items-center justify-start space-x-2 ${
                    unreadMessagecount > 0 ? 'font-bold text-black' : ''
                  }`}
                >
                  {unreadMessagecount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-600 rounded-md"
                    >
                      {unreadMessagecount > 99 ? '99+' : unreadMessagecount}
                    </motion.div>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default memo(Contact, (prev, next) => {
  return prev.contact.email === next.contact.email;
});
