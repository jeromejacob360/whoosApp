import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Contacts from '../components/Contacts';

export default function ContactsListMobile({ openContacts, setOpenContacts }) {
  console.count('ContactsListMobile');
  return (
    <AnimatePresence>
      {openContacts && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="absolute bottom-0 left-0 right-0 bg-white sm:hidden top-20 rounded-2xl"
        >
          <Contacts setOpenContacts={setOpenContacts} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
