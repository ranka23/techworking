import axios from "axios";

import {
  ADD_POST,
  CLEAR_ERRORS,
  DELETE_POST,
  GET_ERRORS,
  GET_POST,
  GET_POSTS,
  POST_LOADING,
} from "./types";

export const addPost = (postData) => (dispatch) => {
  dispatch(clearErrors())
  axios
    .post("/api/posts", postData)
    .then((res) => dispatch({ type: ADD_POST, payload: res.data }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const getPosts = () => (dispatch) => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then((res) => dispatch({ type: GET_POSTS, payload: res.data }))
    .catch((err) => dispatch({ type: GET_POSTS, payload: {} }));
};

export const getPost = (id) => (dispatch) => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then((res) => dispatch({ type: GET_POST, payload: res.data }))
    .catch((err) => dispatch({ type: GET_POST, payload: {} }));
};

export const deletePost = (id) => (dispatch) => {
  axios
    .delete(`/api/posts/${id}`)
    .then((res) => dispatch({ type: DELETE_POST, payload: id }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const likePost = (id) => (dispatch) => {
  axios
    .post(`/api/posts/like/${id}`)
    .then((res) => dispatch(getPosts()))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const unlikePost = (id) => (dispatch) => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then((res) => dispatch(getPosts()))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const addComment = (postId, commentData) => (dispatch) => {
  dispatch(clearErrors())
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then((res) => dispatch({ type: GET_POST, payload: res.data }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const deleteComment = (postId, commentId) => (dispatch) => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then((res) => dispatch({ type: GET_POST, payload: res.data }))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const clearErrors = () => {
  return { type: CLEAR_ERRORS }
}

export const setPostLoading = () => {
  return { type: POST_LOADING };
};