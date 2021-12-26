import { v4 as uuidv4 } from "uuid";

export const profileImgUpload = ({ img, imgType }) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    
    const firebase = getFirebase();
    const firestore = getFirestore();

    const { auth } = getState().firebase;

    // create an Id for the img because there may be images with the same name
    const imgId = uuidv4();

    // initialize the imgUploading state
    dispatch({
      type: "PROFILE_IMG_UPLOADING_INIT"
      , imgName: img.name
      , imgId
      , imgType
    });


    const uploadTask = firebase
    .storage()
    .ref(`/${auth.uid}/${ imgType }/${imgId}`)
    .put(img);

    uploadTask
    .on(
      "state_changed"
      , (snapshot) => {

        const CurrentImgId = getState().editProfile.imgsUploading[imgType].id;

        // I don't know, why it is cancelling the older uploadTask, but it's working.
        // maybe, uploadTask.cancel depends on the ".on()" you're running it from
        // , eventhough in the console it doesn't seem alike.
        if(CurrentImgId && (CurrentImgId !== imgId)) {
          uploadTask.cancel();
        }

        const percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        
        dispatch({
          type: "PROFILE_IMG_UPLOADING_UPDATE"
          , percent
          , imgType
        })

        if(percent === 100) {

          const URLGetter = () => {
            return snapshot
            .ref
            .getDownloadURL()
            .then((downloadURL) => {
              
              firestore
              .collection("users")
              .doc(auth.uid)
              .update({
                [`${imgType}ImgURL`]: downloadURL
              })
              .then(() => {
                dispatch({
                  type: "PROFILE_IMG_UPLOADING_COMPLETE"
                  , percent
                  , url: downloadURL
                  , imgType
                })
              })
            })
          }

          URLGetter()
          .catch(() => { // made 3 catches, to make sure error doesn't happen if the img file is big
            return URLGetter()
          })
          .catch(() => {
            return URLGetter()
          })
          .catch(() => {
            return URLGetter()
          })
        }
      }
      , (err) => {
        dispatch({
          type: "PROFILE_IMG_UPLOADING_ERROR"
          , err
        })
      }
    )
  }
}

export const imgUpload = ({ img, postId }) => {
  return (dispatch, getState, { getFirebase }) => {
    
    const firebase = getFirebase();

    const { auth } = getState().firebase;

    // to get the order of the image using the length of the array
    const imgOrder = getState().img.imgsUploading.length;

    // create an Id for the img because there may be images with the same name
    const imgId = uuidv4();

    // initialize the imgUploading state
    dispatch({ type: "IMG_UPLOADING_INIT", imgName: img.name, imgOrder, imgId });

    firebase
    .storage()
    .ref(`/${auth.uid}/posts/${postId}/${imgId}`)
    .put(img)
    .on(
      "state_changed"
      , (snapshot) => {

        const percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        
        dispatch({
          type: "IMG_UPLOADING_UPDATE"
          , percent
          , imgOrder
        })

        if(percent === 100) {

          const URLGetter = () => {
            return snapshot
            .ref
            .getDownloadURL()
            .then((downloadURL) => {
              
              dispatch({
                type: "IMG_UPLOADING_COMPLETE"
                , percent
                , url: downloadURL
                , imgOrder
              })
            })
          }

          URLGetter()
          .catch(() => {
            return URLGetter()
          })
          .catch(() => {
            return URLGetter()
          })
          .catch(() => {
            return URLGetter()
          })

        }
      }
      , (err) => {
        dispatch({
          type: "IMG_UPLOADING_ERROR"
          , err
        })
      }
    )
  }
}