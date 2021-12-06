import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';
import { encodeEmail } from './formatters';

export default async function sendMessagetoDB({ newMessage, currentChatName }) {
  return new Promise(async (resolve, reject) => {
    try {
      if (newMessage) {
        try {
          // check if that chat contains "read" flag //TODO limit this check to once per chat per session
          const snap = await getDoc(
            doc(db, 'whatsApp/chats', currentChatName, 'flag'),
          );

          // if it doesn't have, add it
          if (!snap.data()) {
            const encodedEmail = encodeEmail(newMessage.from);
            await setDoc(
              doc(db, 'whatsApp/userContacts', newMessage.to, newMessage.from),
              {
                [encodedEmail]: true,
                email: newMessage.from,
              },
            );
            await setDoc(doc(db, 'whatsApp/chats', currentChatName, 'flag'), {
              read: false,
            });
          }

          // add the message to the chat
          await setDoc(
            doc(
              db,
              'whatsApp/chats',
              currentChatName,
              newMessage.time.toString(),
            ),
            { ...newMessage, status: 'sent' },
          );
          resolve(newMessage);
        } catch (error) {
          console.log(`error`, error);
        }
      } else {
        console.log('Missing data');
      }
    } catch (error) {
      console.log(`error`, error);
      reject(error);
    }
  });
}
