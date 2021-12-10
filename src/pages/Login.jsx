import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addUserToContactsMaster } from '../helper-functions/contactsHelper';
import { useDispatch } from 'react-redux';
import { PAGE_LOADING } from '../store/chatSlice';

//----------------------------------------------//
export default function Login() {
  //State variables
  const [email, setEmail] = useState('jerome@gmail.com');
  const [password, setPassword] = useState('123123');

  const dispatch = useDispatch();

  //Side effects
  async function loginUser(e) {
    e.preventDefault();
    if (email && password)
      try {
        dispatch(PAGE_LOADING());
        await signInWithEmailAndPassword(getAuth(), email, password);
        await addUserToContactsMaster(email);
      } catch (error) {
        console.log(`error.message`, error.message);
      }
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <form
        onSubmit={loginUser}
        className="flex flex-col px-3 py-4 space-y-4 rounded-md shadow-2xl bg-gradient-to-tl from-blue-300 to-blue-100 w-80 bg-opacity-60"
      >
        <input
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
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
        <button className="flex items-center justify-center py-1 duration-200 bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg bg-opacity-90 text-icons">
          <span> Login</span>
        </button>
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
