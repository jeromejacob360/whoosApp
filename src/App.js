import { useDispatch, useSelector } from 'react-redux';
import useAuth from './hooks/useAuth';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ImSpinner2 } from 'react-icons/im';
import { PAGE_RENDERED } from './store/chatSlice';
import { useEffect } from 'react';

function App() {
  const user = useSelector((state) => state?.authState.user);
  const pageRendered = useSelector((state) => state.chatState.pageRendered);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      document.title = user.displayName;
    }
  }, [user]);

  useEffect(() => {
    if (user === null) {
      dispatch(PAGE_RENDERED());
    }
  }, [dispatch, user]);

  useAuth();

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {!pageRendered && (
          <motion.div
            exit={{ scale: 0, borderRadius: '50%', opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-blue-200"
          >
            <div className="flex flex-col items-center">
              <ImSpinner2 className={`text-blue-500 animate-spin`} size={80} />
              <div className="py-20 text-3xl text-gray-500">WhoosApp</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-screen h-screen bg-gradient-to-br from-blue-100 to-blue-500">
        <div className="w-screen h-screen pt-4 pb-10 rounded-3xl">
          <AnimatePresence exitBeforeEnter>
            <motion.div className="w-full h-full mx-auto bg-blue-100 rounded-md max-w-screen-2xl">
              <Router>
                <Switch>
                  <Route exact path="/">
                    {user ? <ChatPage /> : <Redirect to="/login" />}
                  </Route>
                  <Route exact path="/login">
                    {user ? <Redirect to="/" /> : <Login />}
                  </Route>
                </Switch>
              </Router>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;
