import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

export default function Title() {
  const currentChatterName = useSelector(
    (state) => state?.chatState.currentChatterName,
  );
  const currentUserAvatar = useSelector(
    (state) => state?.chatState.currentUserAvatar,
  );

  return currentChatterName ? (
    <div className="relative flex items-center justify-between px-4 py-2 bg-titleBG">
      <div className="flex items-center space-x-2">
        <img
          className="w-10 h-10 rounded-full"
          src={currentUserAvatar}
          alt=""
        />
        <h4 className="capitalize">{currentChatterName}</h4>
      </div>
      <div className="flex items-center space-x-4">
        <AiOutlineSearch size={22} />
        <BsThreeDotsVertical size={20} />
      </div>
    </div>
  ) : null;
}
