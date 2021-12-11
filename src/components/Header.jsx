import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Options from '../optionMenus/Options';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Header() {
  const imageUrl = useSelector((state) => state.authState.user.photoURL);
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between h-20 pl-10 pr-4 shadow-md rounded-tl-md bg-blue-50">
      <div>
        <img
          className="object-cover cursor-pointer ring ring-blue-500 w-14 h-14 rounded-xl"
          src={imageUrl}
          alt=""
        />
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
