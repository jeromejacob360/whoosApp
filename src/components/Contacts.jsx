import { onSnapshot, collection } from 'firebase/firestore';
import { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../firebase/firebase';
import { useSubscribeToUserContactsFromContactsApp } from '../hooks/useSubscribeToUserContactsFromContactsApp';
import { chatNameGenerator } from '../helper-functions/formatters';
import { ADD_CHATNAMES } from '../store/chatSlice';

import Contact from './Contact';
import useGetUserContactsAndPopulateChats from '../hooks/useGetUserContactsAndPopulateChats';
import { AnimatePresence, motion } from 'framer-motion';

//----------------------------------------------//
function Contacts({ setOpenContacts }) {
  console.count('');
  const dispatch = useDispatch();

  //Access the store
  const userWAContacts = useSelector(
    (state) => state?.chatState?.userWAContacts,
  );
  const currentUserEmail = useSelector(
    (state) => state?.authState?.user?.email,
  );

  // Side effects

  // set and keep updating the user's contacts in state (userContacts)
  useSubscribeToUserContactsFromContactsApp(currentUserEmail);

  // update the user's WA chats from userContacts set just above
  useGetUserContactsAndPopulateChats(currentUserEmail);

  // get user's chatNames from DB and add it to state
  useEffect(() => {
    let chats = [];
    const unsub = onSnapshot(
      collection(db, 'whatsApp/userContacts', currentUserEmail),
      (snapshot) => {
        chats = [];
        snapshot.docChanges().forEach((change) => {
          const contactEmail = change.doc.id;
          const chatName = chatNameGenerator(contactEmail, currentUserEmail);
          if (change.type === 'added') {
            chats.push(chatName);
          }
          if (change.type === 'removed') {
          }
        });
        dispatch(ADD_CHATNAMES(chats));
      },
    );
    return unsub;
  }, [currentUserEmail, dispatch]);

  if (userWAContacts.length > 0)
    return (
      <AnimatePresence>
        {userWAContacts?.map((contact) => {
          return (
            contact?.email && (
              <motion.div layout key={contact.email}>
                <Contact setOpenContacts={setOpenContacts} contact={contact} />
              </motion.div>
            )
          );
        })}
      </AnimatePresence>
    );
  else return null;
}

export default memo(Contacts);
