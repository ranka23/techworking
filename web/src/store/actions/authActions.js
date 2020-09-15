import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from 'jwt-decode'

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decode = jwt_decode(token)
      // Set the current user
      dispatch(setCurrentUser(decode))

    })
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const setCurrentUser = (decodedValue) => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedValue
  }
}


export const logUserOut = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to {}
  dispatch(setCurrentUser({}))
}