import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore"; // because it is not available in the /compat
import { isEmpty } from "react-redux-firebase";
import { v4 as uuidv4 } from "uuid";

export const deleteComment = (commentObj) => {
  return (dispatch, getState, { getFirestore }) => {

    const firestore = getFirestore();

    const doc = firestore.collection("posts").doc(commentObj.postOwnerId).collection("docs").doc(commentObj.postId);
    
    updateDoc(doc, {
      comments: arrayRemove(commentObj)
    })
    .then(() => {
      dispatch({ type: "COMMENT_DELETE_SUCESS" });
    })
    .catch((err) => {
      dispatch({ type: "COMMENT_DELETE_ERROR", err: err.message });
    })

  }
}

export const createComment = (commentObj) => {
  return (dispatch, getState, { getFirestore }) => {

    const myUid = getState().firebase.auth.uid;
    const firestore = getFirestore();

    const {
      postOwnerId
      , postId
    }=commentObj;

    const doc = firestore.collection("posts").doc(postOwnerId).collection("docs").doc(postId);
    
    updateDoc(doc, {
      comments: arrayUnion(commentObj)
    })
    .then(() => {
      
      /* NOTIFICATION PART START */
      
      const myFriendsUids = getState().firebase.profile.friends;
      if(!myFriendsUids.includes(postOwnerId)) return null;

      if(postOwnerId === myUid) return null;

      const notifId = uuidv4();

      firestore
      .collection("notifications")
      .doc(postOwnerId)
      .collection("notifs")
      .doc(notifId)
      .set({
          type: "COMMENT"
          , ownerId: myUid
          , postId
          , postOwnerId
          , createdAt: new Date()
      })
      .then(() => {

        const doc = firestore.collection("users").doc(postOwnerId);

        return  updateDoc(doc, {
          notifs: arrayUnion(notifId)
        })
      })
    })
    .then(() => {
      dispatch({ type: "COMMENT_CREATE_SUCESS" });
    })
    .catch(() => {
      dispatch({ type: "COMMENT_CREATE_ERROR", err });
    })

  }
}

export const toggleLike = ({ postOwnerId, postId, myUid, liked }) => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
    const doc = firestore.collection("posts").doc(postOwnerId).collection("docs").doc(postId);
    

    updateDoc(doc, {
      likes: liked ? arrayRemove(myUid) : arrayUnion(myUid)
    })
    .then(() => {

      /* NOTIFICATION PART START */
      if(postOwnerId === myUid) return null;

      const myFriendsUids = getState().firebase.profile.friends;
      if(!myFriendsUids.includes(postOwnerId)) return null;

      if(!liked){

        const notifId = uuidv4();

        firestore
        .collection("notifications")
        .doc(postOwnerId)
        .collection("notifs")
        .doc(notifId)
        .set({
          type: "LIKE"
          , ownerId: myUid
          , postId
          , postOwnerId
          , createdAt: new Date()
        })
        .then(() => {

          const doc = firestore.collection("users").doc(postOwnerId);

          return  updateDoc(doc, {
            notifs: arrayUnion(notifId)
          })
        })
    }

    })
    .then(() => {
      dispatch({ type: "LIKE_TOGGLE_SUCESS" });
    })
    .catch(() => {
      dispatch({ type: "LIKE_TOGGLE_ERROR", err });
    })

  }
}

export const deletePost = (postId) => {

  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { auth } = getState().firebase;

    firestore
    .collection("posts")
    .doc(auth.uid)
    .collection("docs")
    .doc(postId)
    .set({}) // to prevent having undefined when fetching data of deleted doc in notifs
    .then(() => {
      dispatch({
        type: "POST_DELETE_SUCCESS"
      })
    })
    .catch((err) => {
      dispatch({
        type: "POST_DELETE_ERROR"
        , err
      })
    })

  }
}

export const postCreate = ({ post }) => {
  return (dispatch, getState, { getFirestore }) => {
    
    const firestore = getFirestore();
  
    const { auth, profile } = getState().firebase;
    const myUid = auth.uid;

    firestore
    .collection("posts")
    .doc(myUid)
    .collection("docs")
    .doc(post.id)
    .set({ ...post, createdAt: new Date() })
    /* NOTIFICATION PART START */
    .then(() => {

      const notifId = uuidv4();

      const {
        id: postId
        , ownerId: postOwnerId
      }=post;

      !isEmpty(profile.friends) && profile.friends.map((friendId) => {

        firestore
        .collection("notifications")
        .doc(friendId)
        .collection("notifs")
        .doc(notifId)
        .set({
            type: "CREATE"
            , ownerId: myUid
            , postId
            , postOwnerId
            , createdAt: new Date()
        })
        .then(() => {

          const doc = firestore.collection("users").doc(friendId);
  
          return  updateDoc(doc, {
            notifs: arrayUnion(notifId)
          })
        })
      });

    })
    .then(() => {
      dispatch({
        type: "POST_CREATE_SUCCESS"
      })
    })
    .catch((err) => {
      dispatch({
        type: "POST_CREATE_ERROR"
        , err
      })
    })
  };
}