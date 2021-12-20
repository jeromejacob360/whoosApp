import React from 'react';
import { useSelector } from 'react-redux';
import Contacts from '../components/Contacts';

export default function ContactsListMobile({ setOpenContacts }) {
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );

  return (
    <div
      className={`absolute duration-100 ease-in-out overflow-hidden bottom-0 left-0 right-0 bg-white sm:hidden top-20 rounded-2xl
        ${currentChatName ? 'w-0' : 'w-full'}
        `}
    >
      <Contacts setOpenContacts={setOpenContacts} />
    </div>
  );
}
