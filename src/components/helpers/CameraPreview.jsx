import { motion } from 'framer-motion';
import React from 'react';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import { BiUndo } from 'react-icons/bi';
import ClickAway from '../../hooks/ClickAway';

export default function CameraPreview({
  closeCamera,
  capturedImage,
  canvasRef,
  videoRef,
  setCapturedImage,
  chatHistoryDimensions,
  imageUploading,
  retake,
}) {
  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL());
    closeCamera();
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: '100%' }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: '100%',
        transition: { duration: 0.5 },
      }}
      className={`absolute bottom-0 flex items-center justify-center ${
        capturedImage ? 'mb-12' : ''
      }`}
      style={{
        width: chatHistoryDimensions.width,
        height: chatHistoryDimensions.height,
      }}
    >
      <ClickAway
        className="flex w-full h-full"
        onClickAway={() => closeCamera()}
      >
        <div className="flex flex-col items-center justify-between w-full h-full bg-dimBG">
          <div className="flex items-center justify-between w-full px-10 py-3 text-white bg-WaGreen">
            <div className="flex items-center">
              <AiOutlineClose
                onClick={
                  capturedImage ? () => setCapturedImage('') : closeCamera
                }
                className="w-5 h-5 mr-4 text-white"
              />
              <span className="text-xl font-semibold">Take photo</span>
            </div>
            {capturedImage && (
              <button onClick={retake} className="flex items-center">
                <BiUndo className="w-6 h-6 mr-2 text-white" />
                <span>Retake</span>
              </button>
            )}
          </div>
          {/* Camera feed */}

          {capturedImage ? (
            <img className="w-9/12" src={capturedImage} alt="captured pic" />
          ) : (
            <video
              ref={videoRef}
              className="w-full max-h-full overflow-hidden object-conain"
            ></video>
          )}

          <div className="relative w-full h-20 bg-darkBG">
            {!capturedImage && (
              <button className="absolute transform bottom-full translate-y-2/4 left-2/4 -translate-x-2/4">
                <AiFillCamera
                  onClick={captureImage}
                  className={`h-16 w-16 p-4 text-white rounded-full shadow-md cursor-pointer bg-flourescentGreen`}
                />
              </button>
            )}
          </div>
        </div>
      </ClickAway>

      <canvas
        className={'opacity-0 w-0 h-0 fixed -bottom-full -top-full invisible'}
        ref={canvasRef}
      ></canvas>
    </motion.div>
  );
}
