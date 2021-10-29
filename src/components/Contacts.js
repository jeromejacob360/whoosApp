import {
  onSnapshot,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase/firebase";
import { getUserContactsFromDB } from "../helpers/contactsHelper";
import {
  chatNameGenerator,
  decodeEmail,
  encodeEmail,
} from "../helpers/formatters";
import { ADD_CHATNAMES, SET_USER_CONTACTS } from "../store/chatSlice";

import Contact from "./Contact";

//----------------------------------------------//
export default function Contacts() {
  console.log("CONTACTS RENDERED");
  const dispatch = useDispatch();

  //Access the store
  const userContactsFromState = useSelector(
    (state) => state?.chatState?.userContacts
  );
  const currentUserEmail = useSelector(
    (state) => state?.authState?.user?.email
  );

  // Side effects
  useEffect(() => {
    async function getUserContactsAndPopulateChats() {
      const userContacts = await getUserContactsFromDB(currentUserEmail);
      dispatch(SET_USER_CONTACTS(userContacts));

      //Populate user's whatsApp chats
      userContacts.forEach(async (contact) => {
        const snap = await getDocs(
          query(
            collection(db, "whatsApp/contactsMaster/contacts"),
            where(encodeEmail(contact.email), "==", true)
          )
        );
        snap.forEach(async (document) => {
          const resEmail = decodeEmail(document.id);
          const chatName = chatNameGenerator(resEmail, currentUserEmail);
          await setDoc(
            doc(db, "whatsApp/usersChats", currentUserEmail, chatName),
            {
              [encodeEmail(chatName)]: true,
            }
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
      collection(db, "whatsApp/usersChats", currentUserEmail),
      (snapshot) => {
        chats = [];
        snapshot.docChanges().forEach((change) => {
          const chatName = change.doc.id;
          if (change.type === "added") {
            chats.push(chatName);
          }
          //TODO add modify and remove
          if (change.type === "modified") {
            console.log("Document modified", chatName);
          }
          if (change.type === "removed") {
            console.log("Document removed", chatName);
          }
        });
        dispatch(ADD_CHATNAMES(chats));
      }
    );
    return unsub;
  }, [currentUserEmail, dispatch]);

  return (
    userContactsFromState &&
    userContactsFromState?.map((contact) => {
      return <Contact key={contact.email} contact={contact} />;
    })
  );
}
