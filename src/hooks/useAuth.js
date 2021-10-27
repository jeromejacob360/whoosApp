import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SIGN_IN_USER, SIGN_OUT_USER } from "../store/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        dispatch(
          SIGN_IN_USER({
            displayName,
            email,
            uid,
            photoURL,
          })
        );
      } else {
        dispatch(SIGN_OUT_USER());
      }
    });
  }, [dispatch]);
}
