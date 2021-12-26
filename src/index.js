// react
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// redux
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store/reducers/rootReducer";
// firebase
import fbConfig from "./config/fbConfig";
// react redux
import { Provider } from "react-redux";
// react redux firebase
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";
// style
import "./style/fontawesome-free-5.15.2-web/css/all.css";
import "./style/index.css";

const store = createStore(
  rootReducer
  , compose(  
      applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
      , reactReduxFirebase(fbConfig, {
          attachAuthIsReady: true
          , useFirestoreForProfile: true
          , userProfile: "users"
          , allowMultipleListeners: true // to prevent sync errors
        })
      , reduxFirestore(fbConfig)
    )
  );

ReactDOM.render(<div className="loading-page"></div>, document.querySelector("#root"));

store
.firebaseAuthIsReady
.then(() => {
  ReactDOM.render(<Provider store={ store }><App/></Provider>, document.querySelector("#root"));
})