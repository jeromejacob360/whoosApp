import { motion } from 'framer-motion';
import React from 'react';
import { AiOutlineClose, AiOutlineLoading } from 'react-icons/ai';
import { BiUndo } from 'react-icons/bi';

export default function CapturedImagePreview({
  imageUploading,
  retake,
  setCapturedImage,
  capturedImage,
}) {
  return (
    <motion.div
      className="relative shadow-md bg-gray-50"
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {imageUploading && (
        <div className="absolute inset-0 grid bg-white bg-opacity-50 place-items-center">
          <AiOutlineLoading className="absolute w-12 h-12 spin" />
        </div>
      )}
      <div className="flex justify-between py-1 bg-gray-50 px-28">
        <button
          onClick={retake}
          className="flex items-center px-2 rounded-md mr-28"
        >
          <BiUndo className="w-6 h-6" />
          <span>Retake</span>
        </button>
        <button
          onClick={() => setCapturedImage('')}
          className="flex items-center px-2 rounded-md"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
      </div>
      <img
        className="mx-auto bg-gray-50 md:w-full xl:w-1/2 lg:w-2/3"
        src={capturedImage}
        alt=""
      />
    </motion.div>
  );
}
