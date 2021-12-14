import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import ContactsListMobile from '../minor-components/ContactsListMobile';
import logo from '../assets/images/logo.jpg';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Options from '../optionMenus/Options';
export default function Title() {
  const [openContacts, setOpenContacts] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const currentChatterName = useSelector(
    (state) => state?.chatState.currentChatterName,
  );
  const currentUserAvatar = useSelector(
    (state) => state?.chatState.currentUserAvatar,
  );
  const messageInfo = useSelector((state) => state.chatState.messageInfo);
  const user = useSelector((state) => state?.authState.user);

  useEffect(() => {
    setOpenContacts(true);
  }, []);

  return currentChatterName ? (
    <div
      className={`z-10 flex items-center justify-between h-20 px-4 shadow-md rounded-tl-md sm:rounded-tl-none  bg-blue-50
    ${!messageInfo && 'rounded-tr-md'}`}
    >
      <div className="flex items-center space-x-2">
        <BiMenu
          size={45}
          className="block sm:hidden"
          onClick={() => setOpenContacts((prev) => !prev)}
        />
        <img
          className="object-cover w-10 h-10 rounded-xl"
          src={currentUserAvatar}
          alt=""
        />
        <motion.h4 layout transition={{ duration: 0.1 }}>
          {currentChatterName}
        </motion.h4>
      </div>

      <BsThreeDotsVertical
        className="block sm:hidden"
        size={20}
        onClick={() => setOpenOptions(!openOptions)}
      />
      {openOptions && <Options setOpenOptions={setOpenOptions} />}

      <ContactsListMobile
        openContacts={openContacts}
        setOpenContacts={setOpenContacts}
      />
    </div>
  ) : (
    <div className="z-10">
      <div className="relative flex items-center justify-between px-5 py-5 bg-blue-200 sm:hidden">
        <img className="object-center w-10 h-10 rounded-lg" src={logo} alt="" />
        <h1 className="flex-1 pl-10 text-2xl text-gray-700">
          {user.displayName}
        </h1>
        <BsThreeDotsVertical
          size={20}
          onClick={() => setOpenOptions(!openOptions)}
        />
        {openOptions && <Options setOpenOptions={setOpenOptions} />}
      </div>
      <ContactsListMobile
        openContacts={openContacts}
        setOpenContacts={setOpenContacts}
      />
    </div>
  );
}
