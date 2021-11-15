import React from 'react';
import { AiOutlineCamera, AiOutlineCloseCircle } from 'react-icons/ai';
import ClickAway from '../../hooks/ClickAway';

export default function CameraPreview({
  closeCamera,
  capturedImage,
  canvasRef,
  videoRef,
  setCapturedImage,
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
    <div className="fixed inset-0 grid w-screen h-screen bg-white place-items-center bg-opacity-80">
      <ClickAway onClickAway={closeCamera}>
        <div className="max-w-xl">
          <div className="flex items-center justify-end h-10 bg-blue-400">
            <AiOutlineCloseCircle
              onClick={closeCamera}
              className="w-6 h-6 ml-8 mr-4 text-white"
            />
          </div>
          {/* Camera feed */}
          <video ref={videoRef} src="" className="w-full h-auto"></video>

          <div className="flex items-center h-10 bg-blue-400">
            <button className="z-10 ml-auto mr-2">
              <AiOutlineCamera
                onClick={captureImage}
                className="w-16 h-16 p-2 mb-10 text-yellow-500 rounded-full shadow-lg cursor-pointer bg-dim"
              />
            </button>
          </div>
        </div>
      </ClickAway>

      <canvas
        className={`w-full h-auto ${
          capturedImage
            ? 'opacity-100'
            : 'opacity-0 w-0 h-0 fixed -bottom-full -top-full'
        }`}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
