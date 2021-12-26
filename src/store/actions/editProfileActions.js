import { getAuth, deleteUser } from "firebase/auth"
import { arrayRemove, updateDoc } from "firebase/firestore";
// FUNCTIONS
import sortMixAlpha from "../../myPlugins/functions/sortMixAlpha";

export const deleteMyAccount = () => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
    const user = getAuth().currentUser;

    const { auth, profile } =getState().firebase;

    const myUid = auth.uid;
    const {
      myConvos
      , friends: myFriends
    } = profile;
    
    // used 4mins instead of 5, because asynchronous task may take some time
    if((new Date() - auth.lastLoginAt) >= 240000) {
      dispatch({
        type: "DELETE_USER_ERROR"
        , err: { message: "This operation is sensitive and requires recent authentication. Log in again before retrying this request." }
      })
    } else {
        
        myConvos && myConvos.map((convoId) => {
          firestore
          .collection("convos")
          .doc(convoId)
          .delete()
        })

        myFriends && myFriends.map((friendId) => {
          
          const doc = firestore.collection("users").doc(friendId);
          const convoId = sortMixAlpha(myUid, friendId);
  
          updateDoc(doc, {
            friends: arrayRemove(myUid)
            , myConvos: arrayRemove(convoId)
            , msgNotifs: arrayRemove(convoId)
            , receivedReqs: arrayRemove(myUid)
          })
        })

        return  firestore
                .collection("users")
                .doc(myUid)
                .delete()
                .then(() => deleteUser(user))
                .catch((err) => {
                  dispatch({
                    type: "DELETE_USER_ERROR"
                    , err
                  })
                })
    }
  }
}

export const editMyProfile = (details) => {
  return (dispatch, getState, { getFirestore }) => {

    let changes = {};
    for(let detail in details ) {
      if(details[detail]) {
        changes = {...changes, [detail]: details[detail]};
      }
    }

    const firestore = getFirestore();
    const myUid = getState().firebase.auth.uid;

    const doc = firestore.collection("users").doc(myUid);
    
    updateDoc(doc, changes)
    .then(() => {
      dispatch({ type: "PROFILE_DETAILS_UPDATE_SUCCESS" });
    })
    .catch((err) => {
      dispatch({ type: "PROFILE_DETAILS_UPDATE_ERROR", err: err.message });
    })

  }
}