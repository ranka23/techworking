import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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


if (localStorage.jwtToken) {;
  
  // Set auth token 
  setAuthToken(localStorage.jwtToken)

  // Decode token and get user info and exp
  const decodedValue = jwt_decode(localStorage.jwtToken)
  // Set user 
  store.dispatch(setCurrentUser(decodedValue))

  // Check for exipred token
  const currentTime = Date.now() / 1000
  if (decodedValue.exp < currentTime) {
    // Logout user
    store.dispatch(logUserOut())

    // TODO: Clear current Profile
    
    // Redirect to login
    window.location.href = '/login';
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
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
