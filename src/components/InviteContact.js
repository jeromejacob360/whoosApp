import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import noAvatar from '../assets/images/no_avatar.png';
import { db } from '../firebase/firebase';

function InviteContact({ contact, setToast }) {
  const [invites, setInvites] = useState([]);

  const currentUserEmail = useSelector((state) => state?.authState.user.email);

  const inviteRef = useRef();

  useEffect(() => {
    async function getContact() {
      const contactDoc = await getDoc(
        doc(db, 'contactsApp/invites/for/', contact.email),
      );
      if (!contactDoc.exists()) return;

      const invites = Object.keys(contactDoc.data());
      setInvites(invites);
    }
    getContact();
  }, [contact.email]);

  async function inviteContact() {
    await setDoc(
      doc(db, 'contactsApp/invites/for/', contact.email),
      {
        [currentUserEmail]: true,
      },
      { merge: true },
    );
    if (!inviteRef.current) return;
    inviteRef.current.classList += 'ring-blue-400 ring whitespace-nowrap';
    inviteRef.current.innerHTML = 'INVITE SENT';
    inviteRef.current.disabled = true;
    setToast(true);
    setTimeout(() => {
      inviteRef.current.classList.remove('ring-blue-400', 'ring');
      setToast(false);
    }, 4000);
  }

  return (
    <div className={`relative flex items-center pl-3 duration-100 w-full `}>
      <div className="mr-3 min-w-max">
        <img
          className="object-cover w-12 h-12 rounded-xl"
          src={contact.imageURL || noAvatar}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start justify-center w-full px-2 h-18">
        <div className="flex items-center justify-between w-full">
          <div>
            <h4 className={`whitespace-nowrap`}>
              {contact.firstName + ' ' + contact.surname}
            </h4>
          </div>
        </div>
      </div>
      <button
        ref={inviteRef}
        disabled={invites.includes(currentUserEmail)}
        onClick={inviteContact}
        className="px-4 justify-self-end py-1 text-gray-700 bg-white border rounded-md shadow-md disabled:cursor-not-allowed active:shadow-sm hover:text-blue-700 duration-100 whitespace-nowrap mr-1"
      >
        {invites.includes(currentUserEmail) ? 'INVITE SENT' : 'INVITE'}
      </button>
    </div>
  );
}

export default InviteContact;
