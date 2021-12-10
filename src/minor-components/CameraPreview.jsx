import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai';
import { BiUndo } from 'react-icons/bi';
import ClickAway from '../hooks/ClickAway';

export default function CameraPreview({
  canvasRef,
  videoRef,
  capturedImage,
  setCapturedImage,
  setPhotoMode,
  setBlob,
}) {
  const [cameraPreviewOn, setCameraPreviewOn] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);

  const openCamera = useCallback(() => {
    navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          setCameraGranted(true);
          setCameraPreviewOn(true);
          const video = videoRef.current;
          video.srcObject = stream;
          video.onloadedmetadata = video.play;
        })
        .catch(function (err) {
          console.log(err);
        });
  }, [videoRef]);

  useEffect(() => {
    openCamera();
  }, [openCamera]);

  useEffect(() => {
    setCapturedImage('');
  }, [setCapturedImage]);

  function captureImage(e) {
    e.stopPropagation();
    setCameraPreviewOn(false);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL());
    canvas.toBlob((blob) => {
      setBlob(blob);
    });
    closeCamera();
  }

  function closeCamera() {
    videoRef.current &&
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  }

  function retake() {
    setCapturedImage('');
    openCamera();
  }
  function endPhotoMode() {
    closeCamera();
    setCapturedImage('');
    setPhotoMode(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      exit={{
        opacity: 0,
        y: '100%',
        transition: { duration: 0.3 },
      }}
      className={`absolute top-20 flex items-center justify-center w-full bottom-0 ${
        capturedImage ? 'mb-16' : ''
      }`}
    >
      <ClickAway
        className="flex w-full h-full"
        onClickAway={() => !capturedImage && endPhotoMode()}
      >
        <div className="flex flex-col items-center justify-between w-full h-full bg-blue-100 ">
          <div className="flex items-center justify-between w-full px-10 py-3 text-white bg-blue-400 shadow-md">
            <div className="flex items-center">
              <AiOutlineClose
                size={25}
                onClick={endPhotoMode}
                className="p-1 mr-4 text-white border rounded-md shadow-sm"
              />
              <span className="text-xl font-semibold">Take photo</span>
            </div>
            {!cameraPreviewOn && (
              <button onClick={retake} className="flex items-center">
                <BiUndo className="w-6 h-6 mr-2 text-white" />
                <span>Retake</span>
              </button>
            )}
          </div>
          {/* Camera feed */}

          <AnimatePresence>
            {capturedImage ? (
              <motion.img
                initial={{ height: '100%', width: '100%' }}
                animate={{ height: '75%', width: '75%' }}
                exit={{ height: '100%', width: '100%' }}
                src={capturedImage}
                alt="captured pic"
                className="object-contain w-full max-h-full overflow-hidden"
              />
            ) : cameraGranted ? (
              <motion.video
                initial={{ width: '75%', opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: '75%', opacity: 0 }}
                ref={videoRef}
                className="object-contain w-full max-h-full overflow-hidden"
              ></motion.video>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="px-4 py-2 text-center text-gray-600 bg-blue-200 rounded-md shadow-md"
              >
                Device camera inaccessible <br /> Please enable it in your
                browser settings
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`relative w-full bg-blue-400 h-20`}>
            {!capturedImage && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-2/4 left-3/4"
              >
                <AiOutlineCamera
                  onClick={captureImage}
                  className={`h-16 w-16 p-4 text-white rounded-full shadow-md cursor-pointer bg-indigo-400`}
                />
              </motion.button>
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
