import { arrayUnion, updateDoc } from "firebase/firestore";

export const msgCreate = ({ msg, convoId }) => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
    
    // message.ownerId is my uid
    const myFriendUid = convoId.replace(msg.ownerId, "");

    const doc = firestore.collection("convos").doc(convoId);

    updateDoc(doc, {
      msgs: arrayUnion({...msg, createdAt: new Date()})
    })
    .then(() => {

      firestore
      .collection("notifications")
      .doc(myFriendUid)
      .collection("msgNotifs")
      .doc(convoId)
      .set({
          ownerId: msg.ownerId
          , text: msg.text
          , createdAt: new Date()
      })
      .then(() => {
        const doc = firestore.collection("users").doc(myFriendUid);

        return  updateDoc(doc, {
          msgNotifs: arrayUnion(convoId)
        })
      })
    })
    .then(() => {
      dispatch({
        type: "MESSAGE_CREATE_SUCCESS"
      })
    })
    .catch((err) => {
      dispatch({
        type: "MESSAGE_CREATE_ERROR"
        , err
      })
    })
    
  };
}