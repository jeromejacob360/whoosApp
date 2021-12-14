import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_INVITEES, SET_USERS_WA_CONTACTS } from '../store/chatSlice';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from '@firebase/firestore';
import { db } from '../firebase/firebase';
import { encodeEmail } from '../helper-functions/formatters';

export default async function useGetUserContactsAndPopulateChats(
  currentUserEmail,
) {
  const dispatch = useDispatch();

  const userContacts = useSelector((state) => state?.chatState?.userContacts);

  useEffect(() => {
    if (currentUserEmail) {
      //Populate user's whatsApp contacts in DB
      userContacts &&
        userContacts?.forEach(async (contact) => {
          const snap = await getDocs(
            query(
              collection(db, 'whatsApp/contactsMaster/contacts'),
              where(encodeEmail(contact.email), '==', true),
            ),
          );
          if (snap.empty) {
            dispatch(ADD_TO_INVITEES(contact));
          }
          snap.forEach(async () => {
            await setDoc(
              doc(db, 'whatsApp/userContacts', currentUserEmail, contact.email),
              {
                [encodeEmail(contact.email)]: true,
                ...contact,
              },
            );
          });
        });

      const q = collection(db, 'whatsApp/userContacts', currentUserEmail);

      onSnapshot(q, (querySnapshot) => {
        let waContacts = [];
        querySnapshot.forEach((doc) => {
          waContacts.push(doc.data());
        });
        dispatch(SET_USERS_WA_CONTACTS(waContacts));
      });
    }
  }, [currentUserEmail, dispatch, userContacts]);
}
