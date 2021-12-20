import { useDispatch, useSelector } from 'react-redux';
import useAuth from './hooks/useAuth';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from './components/LoadingSpinner';
import { PAGE_RENDERED, WINDOW_RESIZE } from './store/chatSlice';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RiFullscreenExitLine, RiFullscreenLine } from 'react-icons/ri';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';
import MaintenanceMode from './pages/MaintenanceMode';

function App() {
  const maintenanceMode = false;

  const user = useSelector((state) => state?.authState.user);
  const pageRendered = useSelector((state) => state.chatState.pageRendered);

  const location = useLocation();
  const dispatch = useDispatch();
  const handle = useFullScreenHandle();

  useEffect(() => {
    if (user) {
      document.title = user.displayName;
    } else {
      document.title = 'WhoosApp';
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

  // just curious to know how long you've been on the app
  useEffect(() => {
    async function getIP() {
      if (!user) return;
      try {
        const ip = await fetch('https://api.ipify.org?format=json');
        const ipData = await ip.json();
        const ipAddress = ipData.ip;

        const obj = {
          ipAddress,
          timestamp: new Date().toISOString(),
        };

        const document = await getDoc(
          doc(db, 'whatsApp/visitorDetails/ips/' + ipAddress),
        );
        if (!document.data()) {
          await setDoc(doc(db, 'whatsApp/visitorDetails/ips/' + ipAddress), {
            ...obj,
            time: 0,
          });
        }
        setInterval(async () => {
          try {
            await updateDoc(
              doc(db, 'whatsApp/visitorDetails/ips/' + ipAddress),
              {
                time: increment(10),
              },
            );
          } catch (e) {}
        }, 10000);
      } catch (e) {}
    }

    getIP();
  }, [user]);

  useAuth();

  if (maintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <>
      <RiFullscreenLine
        className="fixed z-50 top-1 right-1"
        onClick={handle.enter}
      />

      <FullScreen handle={handle}>
        {handle.active && (
          <RiFullscreenExitLine
            className="fixed z-50 top-1 right-1"
            onClick={handle.exit}
          />
        )}
        <LoadingSpinner />
        <motion.div className="w-screen h-screen overflow-x-auto overflow-y-hidden select-none bg-gradient-to-b from-blue-100 to-indigo-300">
          <div className="w-full h-full px-0 py-0 sm:py-4 sm:pb-10 sm:px-6 rounded-3xl">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                initial={{ scale: 0.9, y: 200 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 200 }}
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
      </FullScreen>
    </>
  );
}

export default App;
