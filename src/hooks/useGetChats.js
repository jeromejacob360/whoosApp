import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limitToLast,
} from '@firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import {
  ADD_MESSAGE,
  DELETE_MESSAGE,
  MODIFY_MESSAGE,
} from '../store/chatSlice';

export default function useGetChats() {
  const chatNames = useSelector((state) => state?.chatState?.chatNames);
  const currentUserEmail = useSelector((state) => state?.authState.user?.email);

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubList = [];
    if (!currentUserEmail) return;

    if (chatNames?.length > 0) {
      chatNames.forEach(async (chatName) => {
        const q = query(
          collection(db, 'whatsApp/chats', chatName),
          limitToLast(50),
          orderBy('time', 'asc'),
        );

        const unsub = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const message = change.doc.data();
              dispatch(
                ADD_MESSAGE({
                  chatName,
                  message,
                  currentUserEmail,
                  from: 'server',
                }),
              );
              if (
                message.from === currentUserEmail &&
                (!message.status || message.status === 'sent')
              ) {
              }
            }
            if (change.type === 'modified') {
              const message = change.doc.data();
              dispatch(MODIFY_MESSAGE({ chatName, message }));
            }
            if (change.type === 'removed') {
              const message = change.doc.data();
              dispatch(DELETE_MESSAGE({ chatName, message }));
            }
          });
        });
        unsubList.push(unsub);
      });
    }

    return unsubList.forEach((unsub) => unsub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatNames, currentUserEmail, dispatch]);
}
