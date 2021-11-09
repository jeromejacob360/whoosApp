import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from '@firebase/firestore';
import { SET_USER_CONTACTS, UPDATE_USER_CONTACTS } from '../store/chatSlice';
import { db } from '../firebase/firebase';
import { chatNameGenerator, encodeEmail } from '../helpers/formatters';

export function useSubscribeToUserContactsFromContactsApp(currentUserEmail) {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    if (currentUserEmail) {
      const q = query(
        collection(db, 'contactsApp/userContacts', currentUserEmail),
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        let userContacts = [];
        snapshot.docChanges().forEach((change) => {
          const contact = change.doc.data();
          if (change.type === 'added') {
            userContacts.push(contact);
          }
          if (change.type === 'modified') {
            setDoc(
              doc(
                db,
                `contactsApp/userContacts/${currentUserEmail}/${contact.email}`,
              ),
              contact,
            );
            dispatch(UPDATE_USER_CONTACTS(contact));
          }
          if (change.type === 'removed') {
            // delete that contact from user's waContacts
            const encodedEmail = encodeEmail(contact.email);
            getDoc(
              doc(db, 'whatsApp/userContacts', currentUserEmail, contact.email),
            ).then((doc) => {
              if (doc.exists()) {
                setDoc(
                  doc(
                    db,
                    'whatsApp/userContacts',
                    currentUserEmail,
                    contact.email,
                  ),
                  { [encodedEmail]: true, email: contact.email },
                ).then(() => {
                  // delete the flag that started off this conversation so that it can be re-added by next incoming chat
                  const chatName = chatNameGenerator(
                    currentUserEmail,
                    contact.email,
                  );
                  deleteDoc(doc(db, 'whatsApp/chats', chatName, 'flag'));
                });
              }
            });
          }
        });
        dispatch(SET_USER_CONTACTS(userContacts));
      });
    }
    return unsubscribe;
  }, [currentUserEmail, dispatch]);
}
