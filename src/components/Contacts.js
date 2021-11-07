import {
  onSnapshot,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../firebase/firebase';
import { getUserContactsFromDB } from '../helpers/contactsHelper';
import { chatNameGenerator, encodeEmail } from '../helpers/formatters';
import {
  ADD_CHATNAMES,
  SET_USERS_WA_CONTACTS,
  SET_USER_CONTACTS,
} from '../store/chatSlice';

import Contact from './Contact';

//----------------------------------------------//
export default function Contacts() {
  const dispatch = useDispatch();

  //Access the store
  const userWAContacts = useSelector(
    (state) => state?.chatState?.userWAContacts,
  );
  const currentUserEmail = useSelector(
    (state) => state?.authState?.user?.email,
  );

  // Side effects
  useEffect(() => {
    async function getUserContactsAndPopulateChats() {
      //TODO move this to login page
      const userContacts = await getUserContactsFromDB(currentUserEmail);
      dispatch(SET_USER_CONTACTS(userContacts));

      const q = collection(db, 'whatsApp/userContacts', currentUserEmail);

      onSnapshot(q, (querySnapshot) => {
        let waContacts = [];
        querySnapshot.forEach((doc) => {
          waContacts.push(doc.data());
        });
        dispatch(SET_USERS_WA_CONTACTS(waContacts));
      });

      //Populate user's whatsApp chats
      userContacts.forEach(async (contact) => {
        const snap = await getDocs(
          query(
            collection(db, 'whatsApp/contactsMaster/contacts'),
            where(encodeEmail(contact.email), '==', true),
          ),
        );
        snap.forEach(async (document) => {
          // const resEmail = decodeEmail(document.id);
          // const chatName = chatNameGenerator(resEmail, currentUserEmail);
          await setDoc(
            doc(db, 'whatsApp/userContacts', currentUserEmail, contact.email),
            {
              [encodeEmail(contact.email)]: true,
              ...contact,
            },
          );
        });
      });
    }
    getUserContactsAndPopulateChats();
  }, [currentUserEmail, dispatch]);

  //get user's chatNames from DB and add it to state
  useEffect(() => {
    let chats = [];
    const unsub = onSnapshot(
      collection(db, 'whatsApp/userContacts', currentUserEmail),
      (snapshot) => {
        chats = [];
        snapshot.docChanges().forEach((change) => {
          const contact = change.doc.id;
          const chatName = chatNameGenerator(contact, currentUserEmail);
          if (change.type === 'added') {
            chats.push(chatName);
          }
          //TODO add modify and remove
          if (change.type === 'modified') {
            console.log('Document modified', chatName);
          }
          if (change.type === 'removed') {
            console.log('Document removed', chatName);
          }
        });
        dispatch(ADD_CHATNAMES(chats));
      },
    );
    return unsub;
  }, [currentUserEmail, dispatch]);

  return (
    userWAContacts &&
    userWAContacts?.map((contact) => {
      return contact.email && <Contact key={contact.email} contact={contact} />;
    })
  );
}
