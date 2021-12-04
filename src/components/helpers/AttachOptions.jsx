import React from 'react';
import Document from '../../assets/svgs/Document';
import Contact from '../../assets/svgs/Contact';
import Camera from '../../assets/svgs/Camera';
import Gallery from '../../assets/svgs/Gallery';
import { motion } from 'framer-motion';
import ClickAway from '../../hooks/ClickAway';

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
  close: {
    y: 10,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 20, scale: 0 },
  show: { opacity: 1, y: 0, scale: 1 },
  close: { opacity: 0, y: 30, scale: 0 },
};

export default function AttachOptions({ setAttachOptions, setPhotoMode }) {
  return (
    <ClickAway onClickAway={() => setAttachOptions(false)}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="close"
        className="absolute -left-3 bottom-14"
      >
        <ul className="space-y-4">
          <li className="flex items-center group">
            <motion.div variants={item} className="mr-8 rounded-full">
              <Contact />
            </motion.div>
            <p className="descText">Contact</p>
          </li>

          <li className="flex items-center group">
            <motion.div variants={item} className="mr-8 rounded-full">
              <Document />
            </motion.div>
            <p className="descText">Document</p>
          </li>

          <li className="flex items-center group">
            <motion.div
              onClick={() => {
                setAttachOptions(false);
                setPhotoMode(true);
              }}
              variants={item}
              className="mr-8 rounded-full"
            >
              <Camera />
            </motion.div>
            <p className="descText">Camera</p>
          </li>

          <li className="flex items-center group">
            <motion.div variants={item} className="mr-8 rounded-full">
              <Gallery />
            </motion.div>
            <p className="descText">Gallery</p>
          </li>
        </ul>
      </motion.div>
    </ClickAway>
  );
}
