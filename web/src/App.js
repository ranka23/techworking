import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logUserOut } from "./store/actions/authActions";
import { Provider } from "react-redux";
import store from "./store/store";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { clearCurrentProfile } from "./store/actions/profileActions";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/profile/CreateProfile";
import EditProfile from "./components/profile/EditProfile";
import AddExperience from "./components/credentials/AddExperience";
import AddEducation from "./components/credentials/AddEducation";
import AllProfiles from "./components/profile/AllProfiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/layout/NotFound";
import Posts from "./components/posts/Posts";
import Post from "./components/posts/Post";

if (localStorage.jwtToken) {
  // Set auth token
  setAuthToken(localStorage.jwtToken);

  // Decode token and get user info and exp
  const decodedValue = jwt_decode(localStorage.jwtToken);
  // Set user
  store.dispatch(setCurrentUser(decodedValue));

  // Check for exipred token
  const currentTime = Date.now() / 1000;
  if (decodedValue.exp < currentTime) {
    // Logout user
    store.dispatch(logUserOut());

    // TODO: Clear current Profile
    store.dispatch(clearCurrentProfile());

    // Redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={AllProfiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/feed"
                component={Posts}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/post/:id"
                component={Post}
              />
            </Switch>
            <Route exact path="/not-found" component={NotFound} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
