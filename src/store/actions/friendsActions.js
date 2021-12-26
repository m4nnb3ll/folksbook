import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore"; // because it is not available in the /compat
import { v4 as uuidv4 } from "uuid";
// FUNCTIONS
import sortMixAlpha from "../../myPlugins/functions/sortMixAlpha";

export const unfriend = (targetUid) => {
  return (dispatch, getState, { getFirestore }) => {

    const myUid = getState().firebase.auth.uid;
    const firestore = getFirestore();

    const doc = firestore.collection("users").doc(targetUid);
    
    updateDoc(doc, {
      friends: arrayRemove(myUid)
    })
    .then(() => {
      const doc = firestore.collection("users").doc(myUid);
      return (
        updateDoc(doc, {
          friends: arrayRemove(targetUid)
        })
      );
    })
    .then(() => {
      dispatch({
        type: "UNFRIEND_SUCCESS"
      });
    })
    .catch((err) => {
      dispatch({
        type: "UNFRIEND_ERROR"
        , err
      });
    })
  }
}

export const rejectFriendReq = (targetUid) => {// this is similar to cancelFriendReq, but changes happen in received and sent requests
  return (dispatch, getState, { getFirestore }) => {

    const myUid = getState().firebase.auth.uid;
    const firestore = getFirestore();

    const doc = firestore.collection("users").doc(targetUid);
    
    updateDoc(doc, {
      sentReqs: arrayRemove(myUid)
    })
    .then(() => {
      const doc = firestore.collection("users").doc(myUid);
      return (
        updateDoc(doc, {
          receivedReqs: arrayRemove(targetUid)
        })
      );
    })
    .then(() => {
      dispatch({
        type: "FRIEND_REQ_REJECT_SUCCESS"
      });
    })
    .catch((err) => {
      dispatch({
        type: "FRIEND_REQ_REJECT_ERROR"
        , err
      });
    })
  }
}

export const acceptFriendReq = (targetUid) => {
  return (dispatch, getState, { getFirestore }) => {
    const myUid = getState().firebase.auth.uid;

    const thisConvoId = sortMixAlpha(myUid, targetUid);
    const notifId = uuidv4();

    const firestore = getFirestore();

    /*
    steps:
    remove target from my received reqs
    add target to my friends
    remove me from target sent reqs
    add me to target friends
    */

    const doc = firestore.collection("users").doc(targetUid); // to get target user document
    
    updateDoc(doc, {
      sentReqs: arrayRemove(myUid) // remove my uid from his sentReqs
      , friends: arrayUnion(myUid) // add my uid to his friends
      , myConvos: arrayUnion(thisConvoId)
    })
    .then(() => {
      const doc = firestore.collection("users").doc(myUid); // to get my user document
      return (
        updateDoc(doc, {
          receivedReqs: arrayRemove(targetUid)
          , friends: arrayUnion(targetUid)
          , myConvos: arrayUnion(thisConvoId)
        })
      );
    })
    .then(() => firestore.collection("convos").doc(thisConvoId).set({msgs: []}))
    .then(() => {

      return  firestore
              .collection("notifications")
              .doc(targetUid)
              .collection("notifs")
              .doc(notifId)
              .set({
                  type: "FRIEND_REQ"
                  , ownerId: myUid
                  , createdAt: new Date()
              });
    })
    .then(() => {

      const doc = firestore.collection("users").doc(targetUid);

      return  updateDoc(doc, {
        notifs: arrayUnion(notifId)
      })
    })
    .then(() => {
      dispatch({
        type: "FRIEND_REQ_ACCEPT_SUCCESS"
      });
    })
    .catch((err) => {
      dispatch({
        type: "FRIEND_REQ_ACCEPT_ERROR"
        , err
      });
    })
  }
}

export const cancelFriendReq = (targetUid) => {
  return (dispatch, getState, { getFirestore }) => {

    const myUid = getState().firebase.auth.uid;
    const firestore = getFirestore();

    const doc = firestore.collection("users").doc(targetUid);
    
    updateDoc(doc, {
      receivedReqs: arrayRemove(myUid)
    })
    .then(() => {
      const doc = firestore.collection("users").doc(myUid);
      return (
        updateDoc(doc, {
          sentReqs: arrayRemove(targetUid)
        })
      );
    })
    .then(() => {
      dispatch({
        type: "FRIEND_REQ_CANCEL_SUCCESS"
      });
    })
    .catch((err) => {
      dispatch({
        type: "FRIEND_REQ_CANCEL_ERROR"
        , err
      });
    })
  }
}

export const sendFriendReq = (targetUid) => {
  return (dispatch, getState, { getFirestore }) => {
    const myUid = getState().firebase.auth.uid;
    const firestore = getFirestore();

    const doc = firestore.collection("users").doc(targetUid);
    
    updateDoc(doc, {
      receivedReqs: arrayUnion(myUid)
    })
    .then(() => {
      const doc = firestore.collection("users").doc(myUid);
      return (
        updateDoc(doc, {
          sentReqs: arrayUnion(targetUid)
        })
      );
    })
    .then(() => {
      dispatch({
        type: "FRIEND_REQ_SEND_SUCCESS"
      });
    })
    .catch((err) => {
      dispatch({
        type: "FRIEND_REQ_SEND_ERROR"
        , err
      });
    })
  }
}