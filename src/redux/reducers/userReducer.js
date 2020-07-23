import {
  SET_USER,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  POST_SCREAM,
} from "../types";

import { produce } from "immer";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  screams: [],
  notifications: [],
  loading: false,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return { authenticated: true, ...action.payload, loading: false };
    case LOADING_USER:
      return { ...state, loading: true };
    case LIKE_SCREAM:
      return produce(state, (draftState) => {
        draftState.likes.push({ screamId: action.payload.screamId });
      });
    case UNLIKE_SCREAM:
      return produce(state, (draftState) => {
        draftState.likes = draftState.likes.filter(
          (like) => like.screamId !== action.payload.screamId
        );
      });
    case POST_SCREAM:
      return produce(state, (draftState) => {
        draftState.screams.push(action.payload);
      });
    default:
      return state;
  }
}
