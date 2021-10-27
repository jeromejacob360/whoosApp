import { useSelector } from "react-redux";
import useAuth from "./hooks/useAuth";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const user = useSelector((state) => state?.authState.user);

  useAuth();

  return (
    <div>
      {/* <div className="fixed w-screen bg-yellow-500 h-1/6"></div> */}
      <div className="h-screen max-w-screen-xl mx-auto">
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
      </div>
    </div>
  );
}

export default App;
