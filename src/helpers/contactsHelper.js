import { collection, doc, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase";
import { encodeEmail } from "./formatters";

async function addUserToContactsMaster(email) {
  let formattedEmail = encodeEmail(email);
  await setDoc(doc(db, "whatsApp/contactsMaster/contacts", email), {
    [formattedEmail]: true,
  });
}

async function getUserContactsFromDB(email) {
  if (email) {
    let userContacts = [];
    const snapshot = await getDocs(
      collection(db, "contactsApp/userContacts", email)
    );
    snapshot.forEach((doc) => {
      const { email, firstName, surname } = doc.data();
      userContacts.push({ email, firstName, surname });
    });
    return userContacts;
  }
}

async function getCurrentUsersWaContactsFromDB(email) {
  let waContacts = [];
  const q = collection(db, "whatsApp/usersWAContacts", email);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    waContacts.push(doc.data());
  });
  return waContacts;
}

export {
  getCurrentUsersWaContactsFromDB,
  addUserToContactsMaster,
  getUserContactsFromDB,
};
