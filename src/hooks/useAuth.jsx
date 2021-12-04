import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SIGN_IN_USER, SIGN_OUT_USER } from '../store/authSlice';
import { CLEAR_STATE } from '../store/chatSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user === '') {
        console.log('USER IS EMPTY STRING');
      } else if (user === null) {
        console.log('USER IS NULL');
      } else if (user) {
        console.log('USER LOGGED IN');
      }

      if (user) {
        const { displayName, email, uid, photoURL } = user;
        dispatch(
          SIGN_IN_USER({
            displayName,
            email,
            uid,
            photoURL,
          }),
        );
      } else {
        dispatch(SIGN_OUT_USER());
        dispatch(CLEAR_STATE());
      }
    });
  }, [dispatch]);
}
