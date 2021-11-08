import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator } from '../helpers/formatters';
import {
  NAMELESS_CHAT,
  REMOVE_NAMELESS_CHAT,
  SET_CURRENT_CHAT,
} from '../store/chatSlice';
import noAvatar from '../images/no_avatar.png';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';

//----------------------------------------------//
export default function Contact({ contact }) {
  const dispatch = useDispatch();

  const [contactHasName, setContactHasName] = useState(true);

  //Access the store
  const currentUserEmail = useSelector((state) => state?.authState.user.email);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );

  const chatName = chatNameGenerator(contact.email, currentUserEmail);
  const unreadMessagecount = useSelector(
    (state) => state?.chatState?.unreadMessages[chatName],
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

  const contactName = contactHasName
    ? `${contact.firstName} ${contact.surname ? contact.surname : ''}`
    : contact.email;

  function setChat() {
    dispatch(
      SET_CURRENT_CHAT({
        currentUserEmail,
        currentChatterEmail: contact.email,
        senderName: contactName,
      }),
    );
  }

  return (
    <div
      className={` ${
        contactHasName ? ' border-dim' : 'border-blue-600'
      } relative flex rounded-md items-center px-3 py-2 space-x-2 duration-100 border cursor-pointer hover:border-dodgerblue ${
        currentChatName === chatName ? 'bg-blue-200' : 'bg-main'
      }`}
      onClick={setChat}
    >
      <div>
        <img
          className="object-cover rounded-full w-14 h-14"
          src={contact.imageURL || noAvatar}
          alt=""
        />
      </div>
      <div>
        <h4 className={`${contactHasName ? 'text-black' : 'text-blue-800'}`}>
          {contactName}
        </h4>
      </div>
      {unreadMessagecount && (
        <div className="absolute grid w-6 h-6 text-xs text-white bg-blue-500 rounded-full place-items-center right-4">
          {unreadMessagecount}
        </div>
      )}
    </div>
  );
}
