import { useState, useRef } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addUserToContactsMaster } from '../helper-functions/contactsHelper';
import { useDispatch } from 'react-redux';
import { PAGE_LOADING } from '../store/chatSlice';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

//----------------------------------------------//
export default function Login() {
  //State variables
  const [email, setEmail] = useState('joey@gmail.com');
  const [password, setPassword] = useState('123123');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const optionsRef = useRef();

  //Side effects
  async function loginUser(e) {
    e.preventDefault();

    if (!email || !password) return setError('Please fill out all fields');

    if (email && password)
      try {
        setError(false);
        await signInWithEmailAndPassword(getAuth(), email, password);
        dispatch(PAGE_LOADING());
        await deleteDoc(doc(db, 'contactsApp/invites/for/' + email));
        await addUserToContactsMaster(email);
      } catch (error) {
        console.log('error', error.message);
        if (error.message.includes('Firebase'))
          setError('Username or password is incorrect');
        else setError(error.message);
      }
  }

  return (
    <div className="flex items-center justify-center w-full h-full ">
      <form
        onSubmit={loginUser}
        className="relative flex flex-col px-3 py-4 space-y-4 rounded-md shadow-2xl bg-gradient-to-tl from-blue-300 to-blue-100 w-80 bg-opacity-60"
      >
        <select
          className="px-4 py-2 bg-white border rounded-md outline-none bg-opacity-90"
          ref={optionsRef}
          onChange={(e) => {
            setError(false);
            setEmail(e.target.value);
          }}
        >
          <option disabled defaultValue value="">
            Select a dummy account
          </option>
          <option value="joey@gmail.com">joey@gmail.com</option>
          <option value="chandler@gmail.com">chandler@gmail.com</option>
          <option value="monica@gmail.com">monica@gmail.com</option>
        </select>
        <p className="text-center ">OR</p>
        <input
          value={email}
          required
          onChange={(e) => {
            optionsRef.current.value = '';
            setEmail(e.target.value);
          }}
          placeholder="Username"
          className="px-4 py-2 bg-white border rounded-md outline-none bg-opacity-90"
          type="email"
        />
        <input
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="px-4 py-2 bg-white border rounded-md outline-none bg-opacity-90"
          type="password"
        />
        <button className="flex items-center justify-center py-1 text-gray-600 bg-white rounded-md shadow-md cursor-pointer active:shadow-md duration-00 hover:shadow-lg bg-opacity-90">
          <span> Login</span>
        </button>
        {error && (
          <p className="absolute left-0 right-0 text-xs text-center text-red-600 bottom-10">
            {error}
          </p>
        )}
        <a
          target="_blank"
          className="pt-4 text-sm text-center text-blue-800 underline"
          href={process.env.REACT_APP_contactsRedirectUrl}
          rel="noreferrer"
        >
          Create a React-contacts account
        </a>
      </form>
    </div>
  );
}
