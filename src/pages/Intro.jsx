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
      className="relative flex justify-center h-full text-gray-500 select-none"
      style={{ minWidth: '400px' }}
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
        className="object-cover w-full h-full shadow-md rounded-tr-3xl"
        style={{ borderTopLeftRadius: '50%', borderBottomRightRadius: '50%' }}
      />
      <motion.div
        className="absolute text-7xl bottom-32"
        initial={isRendered ? 'false' : { y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { ease: 'linear', duration: 0.2 },
        }}
      >
        Whoosapp
      </motion.div>
    </main>
  );
}
