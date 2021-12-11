import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { RiShareForwardFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { FORWARD_MODE_OFF } from '../store/chatSlice';

export default function ForwardMenu({ setOpenContactsPicker }) {
  const dispatch = useDispatch();

  const totalSelectedMessages = useSelector(
    (state) => state?.chatState.totalSelectedMessages,
  );
  return (
    <div className="flex items-center h-16 px-4 bg-blue-300">
      <div className="flex items-center justify-between w-full h-10 px-10">
        <button onClick={() => dispatch(FORWARD_MODE_OFF())}>
          <AiOutlineClose className="w-6 h-6" />
        </button>
        <span>{totalSelectedMessages} selected</span>
        <div className="space-x-6">
          {/* <button>
            <AiFillStar className="w-6 h-6" />
          </button>
          <button>
            <AiFillDelete className="w-6 h-6" />
          </button> */}
          <button onClick={() => setOpenContactsPicker(true)}>
            <RiShareForwardFill className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
