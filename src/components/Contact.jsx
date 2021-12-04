import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator, textTrimmer } from '../helper-functions/formatters';
import {
  NAMELESS_CHAT,
  PAGE_RENDERED,
  REMOVE_NAMELESS_CHAT,
  SET_CURRENT_CHAT,
} from '../store/chatSlice';
import noAvatar from '../assets/images/no_avatar.png';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';
import { AnimatePresence, motion } from 'framer-motion';

//----------------------------------------------//
export default function Contact({ contact }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(PAGE_RENDERED());
  }, [dispatch]);

  const [contactHasName, setContactHasName] = useState(true);
  const [chatOpened, setChatOpened] = useState(false);
  const [contactName, setContactName] = useState('');

  //Access the store
  const currentUserEmail = useSelector((state) => state?.authState.user.email);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );

  const chatName = chatNameGenerator(contact.email, currentUserEmail);
  const unreadMessagecount = useSelector(
    (state) => state?.chatState?.unreadMessages[chatName],
  );

  const lastMessage = useSelector(
    (state) => state?.chatState?.lastMessages[chatName],
  );

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
  }, [contact, contact.email, contactHasName, currentUserEmail]);

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

  return (
    <div
      className={`relative w-96 flex items-center px-3 duration-100 cursor-pointer ${
        currentChatName === chatName
          ? 'bg-darkBG'
          : 'bg-whiteBG hover:bg-hoverBG'
      }`}
      onClick={setChat}
    >
      <div className="mr-3 min-w-max">
        <img
          className="object-cover w-12 h-12 rounded-full"
          src={contact.imageURL || noAvatar}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start justify-center w-full px-2 border-b border-darkBG h-18">
        {!contactHasName && !chatOpened && (
          <div className="absolute text-xs text-red-600 top-2">New!</div>
        )}
        <div className="flex items-center justify-between w-full">
          <h4
            className={` ${contactHasName ? 'text-black' : 'text-blue-800'} ${
              unreadMessagecount > 0 ? 'font-medium' : ''
            }`}
          >
            {contactName}
          </h4>
          <p className="text-xs lowercase text-mutedText">
            {lastMessage?.time &&
              new Date(lastMessage?.time).toLocaleTimeString()}
          </p>
        </div>
        <p
          className={`text-sm text-mutedText ${
            unreadMessagecount > 0 ? 'font-bold text-black' : ''
          }`}
        >
          {lastMessage?.message && textTrimmer(lastMessage?.message)}
        </p>
      </div>

      <AnimatePresence>
        {unreadMessagecount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ x: 20, opacity: 0, transition: { ease: 'linear' } }}
            className="absolute grid w-5 h-5 text-xs text-white rounded-full bg-unreadBadgeGreen place-items-center right-6 top-10"
          >
            {unreadMessagecount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
