import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Options from '../optionMenus/Options';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Header() {
  const [openOptions, setOpenOptions] = useState(false);

  const imageUrl = useSelector((state) => state.authState.user.photoURL);
  const user = useSelector((state) => state?.authState.user);

  return (
    <header className="relative z-10 flex items-center justify-between h-20 pl-10 pr-4 shadow-md rounded-tl-md bg-blue-50">
      <div className="flex items-center space-x-5">
        <img
          className="object-cover cursor-pointer ring ring-blue-500 w-14 h-14 rounded-xl"
          src={imageUrl}
          alt=""
        />
        <h2 className="text-xl text-gray-600">{user.displayName}</h2>
      </div>
      <BsThreeDotsVertical
        className="hidden sm:block"
        size={20}
        onClick={() => setOpenOptions(!openOptions)}
      />
      {openOptions && <Options setOpenOptions={setOpenOptions} />}
    </header>
  );
}
