import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { addUserToContactsMaster } from "../helpers/contactsHelper";

//----------------------------------------------//
export default function Login() {
  console.log("LOGIN RENDERED");

  //State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Side effects
  async function loginUser(e) {
    e.preventDefault();
    if (email && password)
      try {
        await signInWithEmailAndPassword(getAuth(), email, password);

        await addUserToContactsMaster(email);
      } catch (error) {
        console.log(`error.message`, error.message);
      }
  }

  return (
    <div className="flex items-center w-screen h-screen -mt-24">
      <form
        onSubmit={loginUser}
        className="flex flex-col px-4 py-6 mx-auto space-y-2 rounded-md shadow-md bg-dim"
        action=""
      >
        <input
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Username"
          className="px-4 py-2 rounded-full outline-none"
          type="text"
        />
        <input
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="px-4 py-2 rounded-full outline-none"
          type="password"
        />
        <button className="py-1 bg-white rounded-md shadow-sm cursor-pointer border-dim text-icons">
          Login
        </button>
        <a
          target="_blank"
          className="text-sm text-center text-blue-600 underline"
          href="https://secretsilentpanda.github.io/react-contacts/signup"
          rel="noreferrer"
        >
          Create a React-contacts account
        </a>
      </form>
    </div>
  );
}
