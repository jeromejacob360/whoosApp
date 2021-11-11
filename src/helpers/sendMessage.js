import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase/firebase';
import { encodeEmail } from './formatters';

export default async function sendMessagetoDB(
  message,
  currentChatterEmail,
  currentUserName,
  currentChatName,
  setMessage,
  chatHistoryRef,
  messageToReply,
  mediaUrl = '',
  time,
) {
  return new Promise(async (resolve, reject) => {
    try {
      let newMessage;
      if (message || mediaUrl) {
        let messageToReplyTrimmed = '';
        if (messageToReply) {
          const { time, from, message, mediaUrl } = messageToReply;
          messageToReplyTrimmed = { time, from, message, mediaUrl };
        }

        newMessage = {
          time,
          message,
          mediaUrl,
          from: currentUserName,
          to: currentChatterEmail,
          deletedForMe: [],
          messageToReply: messageToReplyTrimmed,
        };
        setMessage && setMessage('');

        if (currentChatterEmail && currentChatName && (message || mediaUrl)) {
          try {
            // check if that chat contains "read" flag //TODO limit this check to once per chat per session
            const snap = await getDoc(
              doc(db, 'whatsApp/chats', currentChatName, 'flag'),
            );

            // if it doesn't have, add it
            if (!snap.data()) {
              const encodedEmail = encodeEmail(newMessage.from);
              await setDoc(
                doc(
                  db,
                  'whatsApp/userContacts',
                  newMessage.to,
                  newMessage.from,
                ),
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
              newMessage,
            );

            // scroll down to reveal the new message
            chatHistoryRef &&
              chatHistoryRef.current &&
              chatHistoryRef.current.scrollTo({
                left: 0,
                top: chatHistoryRef.current.scrollHeight,
                behavior: 'smooth',
              });
            resolve(`${message} set in DB`);
          } catch (error) {
            console.log(`error`, error);
          }
        } else {
          console.log('Missing data');
        }
      }
    } catch (error) {
      console.log(`error`, error);
      reject(error);
    }
  });
}
