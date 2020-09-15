import axios from "axios";

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES,
} from "./types";

export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then((res) => dispatch({ type: GET_PROFILE, payload: res.data }))
    .catch((err) => dispatch({ type: GET_PROFILE, payload: {} }));
};

export const getProfile = (handle) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then((res) => dispatch({ type: GET_PROFILE, payload: res.data }))
    .catch((_err) => dispatch({ type: GET_PROFILE, payload: null }));
};

export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const addExperience = (experienceData, history) => (dispatch) => {
  axios
    .post("/api/profile/experience", experienceData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const addEducation = (educationData, history) => (dispatch) => {
  axios
    .post("/api/profile/education", educationData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const deleteExperience = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then((res) => dispatch({ type: GET_PROFILE, payload: res.data }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const deleteEducation = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/education/${id}`)
    .then((res) => dispatch({ type: GET_PROFILE, payload: res.data }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getAllProfiles = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then((res) => dispatch({ type: GET_PROFILES, payload: res.data }))
    .catch((err) => dispatch({ type: GET_PROFILES, payload: null }));
};

export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can't be undone")) {
    axios
      .delete("/api/profile")
      .then((res) => dispatch({ type: SET_CURRENT_USER, payload: {} }))
      .catch((err) =>
        dispatch({ type: GET_ERRORS, payload: err.response.data })
      );
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
