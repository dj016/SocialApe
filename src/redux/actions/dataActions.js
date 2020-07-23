import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "./../types";
import axios from "axios";
import { CardActions } from "@material-ui/core";

//get all screams
export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/screams")
    .then((res) => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_SCREAMS, payload: [] });
      console.log(err);
    });
};

//Like scream

export const likeScream = (screamId) => (dispatch) => {
  console.log("like pressed");
  axios
    .get(`/scream/${screamId}/like`)
    .then((res) => {
      dispatch({ type: LIKE_SCREAM, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteScream = (screamId) => (dispatch) => {
  console.log("delete button pressed");
  axios
    .get(`/scream/${screamId}/delete`)
    .then((res) => {
      dispatch({ type: DELETE_SCREAM, payload: { screamId } });
    })
    .catch((err) => console.log(err));
};

export const postScream = (screamBody) => (dispatch) => {
  //console.log(screamBody);
  axios
    .post("/scream", screamBody)
    .then((res) => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err.response.data);
      if (err.response.data.body) {
        console.log("body error detected");
        dispatch({ type: SET_ERRORS, payload: err.response.data });
      }
    });
};

export const unlikeScream = (screamId) => (dispatch) => {
  console.log("unlike pressed");
  axios
    .get(`/scream/${screamId}/unlike`)
    .then((res) => {
      dispatch({ type: UNLIKE_SCREAM, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};
