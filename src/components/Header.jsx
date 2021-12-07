import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Options from '../optionMenus/Options';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function Header() {
  const imageUrl = useSelector((state) => state.authState.user.photoURL);
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between h-20 pl-20 pr-4 shadow-md rounded-tl-md bg-blue-50">
      <div>
        <img
          className="object-cover shadow-lg cursor-pointer w-14 h-14 rounded-xl"
          src={imageUrl}
          alt=""
        />
      </div>
      <div className="flex space-x-4">
        <BsThreeDotsVertical
          size={20}
          onClick={() => setOpenOptions(!openOptions)}
        />
      </div>
      {openOptions && <Options setOpenOptions={setOpenOptions} />}
    </header>
  );
}
