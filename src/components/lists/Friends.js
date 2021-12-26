import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
// COMPONENTS
import Friend from "../pannels/Friend";

const Friends = (props) => {
  
  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;
  
  const {
    users
    , match
    , firebaseAuth
  }=props;

  const { uid: myUid } = firebaseAuth;
  const { profileId } = match.params;

  return (
    <div className="container large">
      <div className="board friends-wrapper">
        <h3 className="title">
          <span>Friends:</span>
        </h3>
        <ul className="friends-list">
            {
              isLoaded(users && profileId)
                ? users[profileId]
                  //checking "users" below if it is not null
                  ? users && isEmpty(users[profileId].friends)
                    ? <div>{ myUid === profileId ? "You have no friends yet!" : "This user has no friends." }</div>
                    : users[profileId]
                      .friends
                      .map((friendId) => ({friendId, ...users[friendId]}))
                      .map((friend) => {

                        const {
                          friendId
                          , firstname
                          , lastname
                          , profileImgURL
                          , online
                        }=friend;
            
                        return (
                          <Friend
                            key = { friendId }
                            myUid = { myUid }
                            friendId = { friendId }
                            isMyProfile = { myUid === profileId }
                            profileImgURL = { profileImgURL }
                            online = { online  }
                            firstname = { firstname }
                            lastname = { lastname  }
                            inScroll = { true  }
                          />
                        );
                      })
                  : <Redirect to="/404" />
                : <div className="loading-circle"></div>
            }
          </ul>
      </div>
    </div>
  );

}

const mapStateToProps = (state) => ({
  firebaseAuth: state.firebase.auth
  , users: state.firestore.data.users
});

export default compose(
  connect(mapStateToProps)
  , firestoreConnect([{ collection: "users" }])
)(Friends);