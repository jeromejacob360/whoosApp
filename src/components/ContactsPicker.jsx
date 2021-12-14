import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator } from '../helper-functions/formatters';
import sendMessagetoDB from '../helper-functions/sendMessage';
import { ADD_MESSAGE, FORWARD_MODE_OFF } from '../store/chatSlice';
import ClickAway from '../hooks/ClickAway';

export default function ContactsPicker({ setOpenContactsPicker }) {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const dispatch = useDispatch();

  const userWAContacts = useSelector(
    (state) => state?.chatState?.userWAContacts,
  );

  const messagesToForward = useSelector(
    (state) => state?.chatState.selectedMessages,
  );
  const currentUserEmail = useSelector((state) => state?.authState.user?.email);
  const currentChatterEmail = useSelector(
    (state) => state?.chatState.currentChatterEmail,
  );
  const currentUserName = useSelector((state) => state?.authState.user.email);

  function addOrRemoveContact(e, contact) {
    e.target.checked
      ? setSelectedContacts([...selectedContacts, contact.email])
      : setSelectedContacts(
          selectedContacts.filter((email) => email !== contact.email),
        );
  }

  async function sendAway() {
    const argsList = [];
    const messages = Object.values(messagesToForward);
    selectedContacts.forEach((contact) => {
      const currentChatName = chatNameGenerator(contact, currentUserName);
      messages.forEach((messageObj) => {
        const { message, mediaUrl, time } = messageObj;
        argsList.push({
          currentChatName,
          message: {
            message,
            mediaUrl,
            time,
            to: contact,
            from: currentUserEmail,
            deletedForMe: [],
            status: '',
          },
        });
      });
    });

    console.log(`argsList`, argsList);

    setOpenContactsPicker(false);

    argsList.forEach(async (obj) => {
      const { currentChatName, message } = obj;

      dispatch(
        ADD_MESSAGE({
          chatName: currentChatName,
          message,
          currentUserEmail,
        }),
      );

      await sendMessagetoDB({ newMessage: message, currentChatName });
    });
  }

  function endForwardMode() {
    setOpenContactsPicker(false);
    dispatch(FORWARD_MODE_OFF());
  }

  return (
    <main className="fixed inset-0 grid w-screen h-screen text-gray-800 bg-white bg-opacity-80 place-items-center">
      <ClickAway onClickAway={endForwardMode}>
        <div className="relative flex flex-col py-2 bg-blue-300 border rounded-md shadow-lg">
          {userWAContacts?.map((contact) => {
            const contactName = `${
              contact.firstName ? contact.firstName : contact.email
            } ${contact.surname ? contact.surname : ''}`;
            return (
              contact.email !== currentChatterEmail && (
                <label
                  key={contactName}
                  htmlFor={contactName}
                  className="px-4 py-2 bg-white cursor-pointer bg-opacity-30 hover:bg-green-200"
                >
                  <input
                    onChange={(e) => addOrRemoveContact(e, contact)}
                    className="mr-3"
                    value={contact.email}
                    type="checkbox"
                    name="contactName"
                    id={contactName}
                  />
                  {contactName}
                </label>
              )
            );
          })}
          {selectedContacts.length > 0 && (
            <button
              className="absolute right-0 px-4 py-1 mt-4 text-blue-500 bg-gray-100 border rounded-full shadow-lg -bottom-6"
              onClick={sendAway}
            >
              SEND
            </button>
          )}
        </div>
      </ClickAway>
    </main>
  );
}
