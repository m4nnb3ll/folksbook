import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import FriendReq from "../pannels/FriendReq";
// ACTIONS
import { rejectFriendReq, acceptFriendReq } from "../../store/actions/friendsActions";

const FriendRequests = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const {
    firebaseProfile
    , users
    , acceptFriendReq
    , rejectFriendReq
  } = props;
  const { receivedReqs } = firebaseProfile;

  return (
    <div className="container large">
      <div className="results-list-wrapper">
        <h2>Friend requests</h2>
        <ul className="results-list container med">
          {
            isLoaded(users)
              ? isEmpty(receivedReqs)
                ? <div>No Friend Requests Yet...</div>
                : receivedReqs.map((ownerId) => {
                    
                    // incase user got deleted
                    if(!users[ownerId]) return null;

                    const {
                      firstname
                      , lastname
                      , profileImgURL
                    }=users[ownerId];

                    return (
                      <FriendReq
                        key={ ownerId }
                        ownerLink={ `/profile/${ownerId}` }
                        ownerId={ ownerId }
                        firstname={ firstname }
                        lastname={ lastname }
                        profileImgURL={ profileImgURL }
                        acceptFriendReq={ acceptFriendReq }
                        rejectFriendReq={ rejectFriendReq }
                      />
                    );
                  })
              : <div className="loading-circle"></div>
          }
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { auth, profile } = state.firebase;
  const { users } = state.firestore.data;

  return ({
    firebaseAuth: auth
    , firebaseProfile: profile
    , users
  });
}

const mapDispatchToProps = (dispatch) => ({
  acceptFriendReq: (userId) => dispatch(acceptFriendReq(userId))
  , rejectFriendReq: (userId) => dispatch(rejectFriendReq(userId))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect([{ collection: "users" }])
)(FriendRequests);