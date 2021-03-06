import { onSnapshot, collection } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../firebase/firebase';
import { useSubscribeToUserContactsFromContactsApp } from '../hooks/useSubscribeToUserContactsFromContactsApp';
import { chatNameGenerator } from '../helper-functions/formatters';
import { ADD_CHATNAMES, PAGE_RENDERED } from '../store/chatSlice';
import InviteContact from '../components/InviteContact';
import Contact from './Contact';
import useGetUserContactsAndPopulateChats from '../hooks/useGetUserContactsAndPopulateChats';
import { AnimatePresence, motion } from 'framer-motion';

//----------------------------------------------//
function Contacts({ setOpenContacts }) {
  const [noWaContacts, setNoWaContacts] = useState(false);
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();

  //Access the store
  const contactsToInviteObj = useSelector((state) => state.chatState.invitees);
  const contactsToInvite = Object.values(contactsToInviteObj);
  const userWAContacts = useSelector(
    (state) => state?.chatState?.userWAContacts,
  );
  const currentUserEmail = useSelector(
    (state) => state?.authState?.user?.email,
  );

  const windowWidth = useSelector((state) => state?.chatState?.windowWidth);

  // Side effects

  useEffect(() => {
    if (userWAContacts.length === 0) {
      setNoWaContacts(true);
    } else {
      setNoWaContacts(false);
    }
  }, [userWAContacts]);

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

  useEffect(() => {
    setTimeout(() => {
      dispatch(PAGE_RENDERED());
    }, 5000);
  }, [dispatch]);

  return (
    <motion.div className="relative h-full" layout>
      {noWaContacts && (
        <div className="px-4 py-2 ">
          <h1 className="text-gray-500">
            Looks like your friends haven't found the app yet. Try inviting?
          </h1>
        </div>
      )}
      {userWAContacts &&
        userWAContacts?.map((contact) => {
          return (
            contact?.email && (
              <motion.div layout={windowWidth >= 640} key={contact.email}>
                <Contact setOpenContacts={setOpenContacts} contact={contact} />
              </motion.div>
            )
          );
        })}
      <div className="h-2 bg-gray-200"></div>
      {contactsToInvite &&
        contactsToInvite?.map((contact) => {
          return (
            contact?.email && (
              <motion.div
                layout={windowWidth >= 640}
                key={contact.email + 'invite'}
              >
                <InviteContact setToast={setToast} contact={contact} />
              </motion.div>
            )
          );
        })}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, bottom: 0 }}
            animate={{ opacity: 1, bottom: 100 }}
            exit={{ opacity: 0, bottom: 0 }}
            className="fixed max-w-sm mx-auto px-2 xs:px-8 left-4 right-4 bottom-20 py-1 flex justify-center bg-gray-400 text-white rounded-lg text-center"
          >
            <span>They will see the invite in their contacts app</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(Contacts);
