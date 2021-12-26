import React from 'react';
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import FriendsBoard from '../boards/FriendsBoard';
import ProfileBtns from "../buttons/ProfileBtns";
import OwnPosts from '../posts/OwnPosts';
import WallpaperImgWrapper from "./WallpaperImgWrapper"
import Bio from "../pannels/Bio";
// ACTIONS
import { rejectFriendReq, acceptFriendReq, sendFriendReq, cancelFriendReq, unfriend } from "../../store/actions/friendsActions";
import { showModal } from "../../store/actions/modalActions";
// FUNCTIONS
import sortMixAlpha from "../../myPlugins/functions/sortMixAlpha";

const Profile = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const {
    firebaseAuth
    , match
    , users
    , history
    , firebaseProfile: myProfile
    // actions
    , unfriend
    , sendFriendReq
    , cancelFriendReq
    , acceptFriendReq
    , rejectFriendReq
    , showModal
  } = props;

  const { uid: myUid } = firebaseAuth;
  const { id: profileId } = match.params;

  if(isLoaded(users) && !users[profileId]) {
    // if a user was not found
    return <Redirect to="/404"/>
  } else if(myUid === profileId) {
    // Redirects to /myprofile if the link links to my profile
    return <Redirect to="/myprofile"/>;
  }

  const {
    firstname
    , lastname
    , profileImgURL
    , wallpaperImgURL
    , bio
    , friends: profileFriendsUids
  } = (isLoaded(users) && !isEmpty(users)) && users[profileId];

  const {
    friends: myFriendsUids
    , sentReqs
    , receivedReqs
  } = myProfile;

  return isLoaded(myFriendsUids)
    ? isEmpty(myFriendsUids) || !myFriendsUids.includes(profileId)
      ? (() => {
                return (
                  <div className="container large profile">
                    <WallpaperImgWrapper
                      profileImgURL={ profileImgURL }
                      wallpaperImgURL={ wallpaperImgURL }
                    />
                    { 
                      sentReqs && sentReqs.includes(profileId)
                        ? <ProfileBtns
                            type="sent"
                            cancelFriendReq={ cancelFriendReq }
                          />
                        : receivedReqs && receivedReqs.includes(profileId)
                          ? <ProfileBtns
                              type="received"
                              acceptFriendReq={ acceptFriendReq }
                              rejectFriendReq={ rejectFriendReq }
                            />
                          : <ProfileBtns sendFriendReq={ sendFriendReq }/>
                    }
                    <p className="txt-center profile-name ">{`${firstname} ${lastname}`}</p>
                    <Bio text={ bio } />
                  </div>
                )
              })()
      : (() => {
                return (
                  <div className="container large profile">
                    <WallpaperImgWrapper
                      profileImgURL={ profileImgURL }
                      wallpaperImgURL={ wallpaperImgURL }
                    />
                    <ProfileBtns
                      type="friend" 
                      unfriend={ showModal.bind(this, "Are you sure you want to unfriend?", { sideFunction: unfriend, choice: true }) }
                      convoLink={ `/convo/${sortMixAlpha(myUid, profileId)}` }
                    />
                    <p className="txt-center profile-name ">{`${firstname} ${lastname}`}</p>
                    
                    <div className="profile-btm-wrapper owl-stacker-2">
                      <div className="profile-left owl-stacker-2">
                        <Bio text={ bio } />
                        {
                          (isLoaded(users) && !isEmpty(users))
                            ? <FriendsBoard
                                profileFriendsUids={ profileFriendsUids }
                                users={ users }
                                myUid={myUid}
                                profileId={ profileId }
                              />
                            : <div className="loading-circle"></div>
                        }
                      </div>
                      <section className="pannel-posts-wrapper">
                          <h3 className="txt-center">Posts:</h3>
                          <OwnPosts
                            myUid={myUid}
                            history={history}
                            profileId={ profileId }
                            firstname={firstname}
                            lastname={lastname}
                            profileImgURL={profileImgURL}
                          />
                      </section>
                    </div>
                  </div>
                )
              })()
    : <div className="loading-circle"></div>
}

const mapStateToProps = (state) => {
  
  const { auth, profile } = state.firebase;
  const { users } = state.firestore.data;

  return {
    firebaseAuth: auth
    , firebaseProfile: profile
    , users
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const userId = ownProps.match.params.id;

  return {
    unfriend: () => dispatch(unfriend(userId))
    , sendFriendReq: () => dispatch(sendFriendReq(userId))
    , cancelFriendReq: () => dispatch(cancelFriendReq(userId))
    , acceptFriendReq: () => dispatch(acceptFriendReq(userId))
    , rejectFriendReq: () => dispatch(rejectFriendReq(userId))
    , showModal: (content, params) => dispatch(showModal(content, params))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect([{ collection: "users" }])
)(Profile);