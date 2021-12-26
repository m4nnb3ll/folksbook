import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import authReducer from "./authReducer";
import postReducer from "./postReducer";
import imgReducer from "./imgReducer";
import modalReducer from "./modalReducer";
import navTabReducer from "./navTabReducer";
import editProfileReducer from "./editProfileReducer";

const rootReducer = combineReducers({
  auth: authReducer
  , post: postReducer
  , img: imgReducer
  , modal: modalReducer
  , navTab: navTabReducer
  , firebase: firebaseReducer
  , firestore: firestoreReducer
  , editProfile: editProfileReducer
  // to keep track of location
  , location: () => window.location.hash.replace(/\#\//, "")
});

export default rootReducer;