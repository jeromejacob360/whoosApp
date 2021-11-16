import React, { useEffect, useRef } from 'react';
import intro from '../assets/intro.jpg';
import { IoMdLaptop } from 'react-icons/io';
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
        initial={isRendered ? 'false' : { scale: 0.8 }}
        animate={{ scale: 1, transition: { ease: 'linear', duration: 0.1 } }}
        src={intro}
        alt=""
        className="object-contain h-72 w-72"
      />
      <motion.div
        initial={isRendered ? 'false' : { y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { ease: 'linear', duration: 0.1 },
        }}
      >
        <h1 className="pt-8 text-4xl font-thin" style={{ color: '#525252' }}>
          Keep your phone connected
        </h1>
        <p className="py-8 mb-8 border-b">
          WhatsApp connects to your phone to sync messages. To reduce data
          usage, connect your phone to Wi-Fi.
        </p>
        <footer className="flex items-center">
          <IoMdLaptop size={20} className="cursor-default" />
          <p>
            Make calls from desktop with WhatsApp for Windows.{' '}
            <a
              className="text-WaGreen"
              href="https://www.whatsapp.com/download"
            >
              Get it here.
            </a>
          </p>
        </footer>
      </motion.div>
    </main>
  );
}
