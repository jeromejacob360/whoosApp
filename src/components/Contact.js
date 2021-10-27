import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_CHAT, SET_CURRENT_CHATTER } from "../store/chatSlice";

export default function Contact({ contact }) {
  const dispatch = useDispatch();
  const currentUserEmail = useSelector((state) => state?.authState.user.email);

  function setChat() {
    dispatch(
      SET_CURRENT_CHAT({ currentUserEmail, currentChatterEmail: contact.email })
    );
    dispatch(SET_CURRENT_CHATTER(contact.email));
  }

  return (
    <div
      className={`relative flex items-center px-3 py-2 space-x-2 duration-100 border cursor-pointer border-dim hover:border-icons`}
      onClick={setChat}
    >
      <div>
        <img
          className="object-cover rounded-full w-14 h-14"
          src={
            contact.imageURL ||
            `https://source.unsplash.com/160x${Math.floor(
              Math.random() * 100 + 100
            )}/?face7`
          }
          alt=""
        />
      </div>
      <div>
        <h4>{contact.firstName + " " + contact.lastName}</h4>
      </div>
    </div>
  );
}
