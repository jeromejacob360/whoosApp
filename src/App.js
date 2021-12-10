import { useDispatch, useSelector } from 'react-redux';
import useAuth from './hooks/useAuth';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ImSpinner2 } from 'react-icons/im';
import { PAGE_RENDERED, WINDOW_RESIZE } from './store/chatSlice';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const user = useSelector((state) => state?.authState.user);
  const pageRendered = useSelector((state) => state.chatState.pageRendered);

  const location = useLocation();
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

  useEffect(() => {
    dispatch(WINDOW_RESIZE({ width: window.innerWidth }));
    window.addEventListener('resize', () => {
      dispatch(WINDOW_RESIZE({ width: window.innerWidth }));
    });
  }, [dispatch]);

  useAuth();

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {!pageRendered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-blue-200"
          >
            <div className="flex flex-col items-center">
              <ImSpinner2 className={`text-blue-500 animate-spin`} size={80} />
              <div className="py-20 text-3xl text-gray-500">WhoosApp</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="w-screen h-screen overflow-x-auto overflow-y-hidden select-none bg-gradient-to-b from-blue-100 to-indigo-300">
        <div className="w-screen h-screen px-0 py-0 sm:py-4 sm:pb-10 sm:px-6 rounded-3xl">
          <AnimatePresence exitBeforeEnter>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 200 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 200 }}
              transition={{ duration: 0.1, delay: 0.1 }}
              className={`mx-auto overflow-x-auto ${
                location.pathname === '/' && 'bg-blue-100'
              } rounded-3xl max-w-screen-2xl transition duration-1000 ${
                pageRendered
                  ? 'h-full w-full overflow-x-visible'
                  : 'overflow-hidden w-0 h-0'
              } `}
            >
              <Switch>
                <Route exact path="/login">
                  {user ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route path="/">
                  {user ? <ChatPage /> : <Redirect to="/login" />}
                </Route>
              </Switch>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

export default App;
