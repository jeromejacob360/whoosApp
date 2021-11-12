import { getAuth, signOut } from '@firebase/auth';
import React from 'react';
import { motion } from 'framer-motion';
import ClickAway from '../../hooks/ClickAway';

export default function Options({ setOpenOptions }) {
  async function signout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => console.log('Signed Out'))
      .catch((error) => console.log(`error`, error));
  }
  return (
    <ClickAway
      classNames="absolute top-0 -right-8"
      onClickAway={() => setOpenOptions(false)}
    >
      <motion.div
        initial={{ width: 0, height: 0 }}
        animate={{ width: 'auto', height: 'auto' }}
        exit={{ width: 0, height: 0 }}
        className={`absolute bg-white rounded-md shadow-md right-16 top-10 overflow-hidden z-50`}
      >
        <ul className="w-40 py-3 space-y-3 text-sm text-icons">
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">New Group</div>
          </li>
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Archived</div>
          </li>
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Starred</div>
          </li>
          <li className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Settings</div>
          </li>
          <li onClick={signout} className="w-full cursor-pointer hover:bg-dim">
            <div className="py-1 pl-6">Logout</div>
          </li>
        </ul>
      </motion.div>
    </ClickAway>
  );
}
