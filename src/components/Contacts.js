import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import {
  getCurrentUsersWaContactsFromDB,
  getUserContactsFromDB,
} from "../helpers/contactsHelper";
import Contact from "./Contact";

export default function Contacts() {
  const [userContacts, setUserContacts] = useState([]);
  const [usersWAContacts, setUsersWAContacts] = useState([]);

  const email = useSelector((state) => state?.authState?.user?.email);
  const contacts = useSelector((state) => state?.chatState?.contacts);
  const currentUserName = useSelector((state) => state?.authState?.user?.email);

  useEffect(() => {
    async function foo() {
      const userContacts = await getUserContactsFromDB(email);
      setUserContacts(userContacts);
    }
    foo();
  }, [email]);

  //add those of user's contacts which are there in master contacts list, to users WA contacts list so that they can find each other in WA
  useEffect(() => {
    userContacts &&
      userContacts?.forEach(async (contact) => {
        //TODO use cloud functions for this conversion
        let email = contact.email.replaceAll(".", "!!"); //firestore docID cannot contain '.'
        const q = query(
          collection(db, "whatsApp/contactsMaster/contacts"),
          where(email, "==", true)
        );
        const querySnapshot = await getDocs(q);
        // if that user has WA
        if (!querySnapshot.empty) {
          //add that contact to his WA contacts list
          await setDoc(
            doc(db, "whatsApp/usersWAContacts", currentUserName, email),
            contact
          );
        }
      });
  }, [contacts, currentUserName, userContacts]);

  //populate current user's WA contacts
  useEffect(() => {
    const foo = async () => {
      setTimeout(async () => {
        const res = await getCurrentUsersWaContactsFromDB(email);
        setUsersWAContacts(res);
      }, 1000);
    };
    if (email) {
      foo();
    }
  }, [email]);

  return usersWAContacts?.map((contact) => {
    return <Contact key={contact.email} contact={contact} />;
  });
}
