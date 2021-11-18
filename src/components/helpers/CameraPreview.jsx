import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import { BiUndo } from 'react-icons/bi';
import ClickAway from '../../hooks/ClickAway';

export default function CameraPreview({
  chatHistoryDimensions,
  canvasRef,
  videoRef,
  capturedImage,
  setCapturedImage,
  setPhotoMode,
}) {
  const [cameraPreviewOn, setCameraPreviewOn] = useState(false);

  const openCamera = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
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
    console.log(`capturedImage`, capturedImage);
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
      className={`absolute bottom-0 flex items-center justify-center ${
        capturedImage ? 'mb-16' : ''
      }`}
      style={{
        width:
          chatHistoryDimensions.width === '100%'
            ? chatHistoryDimensions.width
            : chatHistoryDimensions.width + 'px',
        height: capturedImage
          ? chatHistoryDimensions.height - 65 + 'px'
          : chatHistoryDimensions.height + 'px',
      }}
    >
      <ClickAway
        className="flex w-full h-full"
        onClickAway={() => !capturedImage && endPhotoMode()}
      >
        <div className="flex flex-col items-center justify-between w-full h-full bg-dimBG">
          <div className="flex items-center justify-between w-full px-10 py-3 text-white bg-WaGreen">
            <div className="flex items-center">
              <AiOutlineClose
                onClick={endPhotoMode}
                className="w-5 h-5 mr-4 text-white"
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
                initial={{ width: '100%' }}
                animate={{ width: '75%' }}
                exit={{ width: '100%' }}
                src={capturedImage}
                alt="captured pic"
              />
            ) : (
              <motion.video
                initial={{ width: '75%', opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: '75%', opacity: 0 }}
                ref={videoRef}
                className="w-full max-h-full overflow-hidden object-conain"
              ></motion.video>
            )}
          </AnimatePresence>

          <div
            className={`relative w-full h-20 ${
              cameraPreviewOn ? ' bg-darkBG' : 'bg-dim'
            }`}
          >
            {!capturedImage && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-full left-2/4"
              >
                <AiFillCamera
                  onClick={captureImage}
                  className={`h-16 w-16 p-4 text-white rounded-full shadow-md cursor-pointer bg-flourescentGreen`}
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
