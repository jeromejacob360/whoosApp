import React, { useEffect } from 'react';
import intro from '../assets/images/intro.jpg';
import { motion } from 'framer-motion';

let isRendered = false;
export default function Intro() {
  useEffect(() => {
    isRendered = true;
  }, []);

  return (
    <main
      className="flex flex-col items-center justify-center h-full px-20 text-center select-none bg-introBG"
      style={{ color: 'rgba(0,0,0,0.45)', minWidth: '400px' }}
    >
      <motion.img
        initial={isRendered ? 'false' : { scale: 0.8, opacity: 0.8 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { ease: 'linear', duration: 0.2 },
        }}
        src={intro}
        alt=""
        className="object-contain h-72 w-72"
      />
      <motion.div
        initial={isRendered ? 'false' : { y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { ease: 'linear', duration: 0.2 },
        }}
      >
        <h1 className="pt-8 text-4xl font-thin" style={{ color: '#525252' }}>
          Keep your phone connected
        </h1>
        <p className="py-8 mb-8 border-b">
          WhoosApp connects to your phone to sync messages. To reduce data
          usage, connect your phone to Wi-Fi.
        </p>
        <footer className="flex items-center justify-center">
          <p>
            Make calls from desktop with WhoosApp for Windows.
            <a
              className="text-WaGreen"
              href="https://www.WhoosApp.com/download"
            >
              {' '}
              Get it here.
            </a>
          </p>
        </footer>
      </motion.div>
    </main>
  );
}
