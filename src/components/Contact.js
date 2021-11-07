import { useDispatch, useSelector } from 'react-redux';
import { chatNameGenerator } from '../helpers/formatters';
import { SET_CURRENT_CHAT } from '../store/chatSlice';
import noAvatar from '../images/no_avatar.png';

//----------------------------------------------//
export default function Contact({ contact }) {
  const dispatch = useDispatch();

  //Access the store
  const currentUserEmail = useSelector((state) => state?.authState.user.email);
  const currentChatName = useSelector(
    (state) => state?.chatState?.currentChatName,
  );
  const chatName = chatNameGenerator(contact.email, currentUserEmail);

  //Check if the contact has a name
  const contactHasName = !!(contact.firstName || contact.surname);

  const contactName = contactHasName
    ? `${contact.firstName} ${contact.surname}`
    : contact.email;

  function setChat() {
    dispatch(
      SET_CURRENT_CHAT({
        currentUserEmail,
        currentChatterEmail: contact.email,
        senderName: contactName,
      }),
    );
  }

  return (
    <div
      className={` ${
        contactHasName ? ' border-dim' : 'border-blue-600'
      } relative flex rounded-md items-center px-3 py-2 space-x-2 duration-100 border cursor-pointer hover:border-dodgerblue ${
        currentChatName === chatName ? 'bg-blue-200' : 'bg-main'
      }`}
      onClick={setChat}
    >
      <div>
        <img
          className="object-cover rounded-full w-14 h-14"
          src={contact.imageURL || noAvatar}
          alt=""
        />
      </div>
      <div>
        <h4 className={`${contactHasName ? 'text-black' : 'text-blue-800'}`}>
          {contactName}
        </h4>
      </div>
    </div>
  );
}
