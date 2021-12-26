import { arrayRemove, updateDoc } from "firebase/firestore";

export const selectNavTab = (navTab) => {

  return ({
    type: "SELECT_NAV_TAB"
    , navTab
  });
}

export const cleanReceivedReqs = (uidToRemove) => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
    const myUid = getState().firebase.auth.uid;

    const doc = firestore.collection("users").doc(myUid);
    
    updateDoc(doc, {
      receivedReqs: arrayRemove(uidToRemove)
    })
    .then(() => {
      dispatch({ type: "RECEIVED_REQS_CLEAN_SUCESS" });
    })
    .catch((err) => {
      dispatch({ type: "RECEIVED_REQS_CLEAN_ERROR", err });
    })

  }
}

export const clearNotifs = (notifType) => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
    const myUid = getState().firebase.auth.uid;

    const doc = firestore.collection("users").doc(myUid);
    
    updateDoc(doc, {
      [notifType]: []
    })
    .then(() => {
      dispatch({ type: "NOTIF_CLEAR_SUCESS" });
    })
    .catch((err) => {
      dispatch({ type: "NOTIF_CLEAR_ERROR", err });
    })

  }
}