import { collection, doc, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase";

async function addUserToContactsMaster(email) {
  let formattedEmail = email.replaceAll(".", "!!");
  await setDoc(
    doc(db, "whatsApp/contactsMaster/contacts", email.replaceAll(".", "!!")),
    {
      [formattedEmail]: true,
    }
  );
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

async function getUserContactsFromDB(email) {
  let userContacts = [];
  const snapshot = await getDocs(collection(db, "contacts/users", email));
  snapshot.forEach((doc) => {
    userContacts.push(doc.data());
  });
  return userContacts;
}

export {
  getCurrentUsersWaContactsFromDB,
  addUserToContactsMaster,
  getUserContactsFromDB,
};
