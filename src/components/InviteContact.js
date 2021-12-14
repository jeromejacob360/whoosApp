import noAvatar from '../assets/images/no_avatar.png';

function Contact({ contact }) {
  return (
    <div className={`relative flex items-center px-3 duration-100 w-full `}>
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
      <button className="px-4 py-1 mr-4 text-gray-700 bg-white border rounded-md shadow-md">
        INVITE
      </button>
    </div>
  );
}

export default Contact;
