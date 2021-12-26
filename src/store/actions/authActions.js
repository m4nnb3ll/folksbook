export const signOut = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    
    const firebase = getFirebase();
    const firestore = getFirestore();
    const { uid: myUid } = getState().firebase.auth;

    firestore
    .collection("users")
    .doc(myUid)
    .update({ online: false })
    .then(() => firebase.auth().signOut())
    .then(() => {
      dispatch({ type: "SIGN_OUT_SUCCESS" });
      // to remove ".active" from the open tab
      dispatch({ type: "CHOOSE_NAV_TAB" });
    })
    .catch((err) => {
      dispatch({
        type: "SIGN_OUT_ERROR"
        , err
      })
    })

  }
}

export const signUp = ({ email, password, firstname, lastname }) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({user}) => {
      return (
        firestore
        .collection("users")
        .doc(user.uid)
        .set({
          firstname
          , lastname
          , bio: null
          , friends: []
          , notifs: []
          , msgNotifs: []
          , myConvos: []
          , sentReqs: []
          , receivedReqs: []
          , profileImgURL: null
          , wallpaperURL: null
          , online: true
        })
      );
    })
    .then(() => {
      dispatch({
        type: "SIGN_UP_SUCCESS"
        , user: { email, password, firstname, lastname }
      });
    })
    .catch((err) => {
      dispatch({
        type: "SIGN_UP_ERROR"
        , err
      })
    })

  }
}

export const signIn = ({ email, password }) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return  firestore
              .collection("users")
              .doc(user.uid)
              .update({ online: true });

    })
    .then(() => {
      dispatch({
        type: "SIGN_IN_SUCCESS"
        , email
        , password
      })
    })
    .catch((err) => {
      dispatch({
        type: "SIGN_IN_ERROR"
        , err
      })
    })

  }
}