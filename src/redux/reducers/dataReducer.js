import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
} from "../types";

import { produce } from "immer";

const initialState = {
  screams: [],
  loading: false,
  errors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, loading: true };
    case SET_SCREAMS:
      return { ...state, screams: action.payload, loading: false };
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      return produce(state, (draftState) => {
        draftState.screams[index] = action.payload;
      });

    case DELETE_SCREAM:
      let indx = state.screams.findIndex(
        (scream) => scream.screamId === action.payload.screamId
      );
      return produce(state, (draftState) => {
        draftState.screams.splice(indx, 1);
      });
    case POST_SCREAM:
      return produce(state, (draftState) => {
        draftState.screams = [action.payload, ...draftState.screams];
      });
    case SET_ERRORS:
      return produce(state, (draftState) => {
        draftState.errors = action.payload;
      });
    case CLEAR_ERRORS:
      return { ...state, errors: {} };
    default:
      return state;
  }
}
