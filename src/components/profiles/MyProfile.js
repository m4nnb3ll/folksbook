import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
// COMPONENTS
import PostPannel from '../pannels/PostPannel';
import FriendsBoard from '../boards/FriendsBoard';
import ProfileBtns from "../buttons/ProfileBtns";
import OwnPosts from '../posts/OwnPosts';
import WallpaperImgWrapper from "./WallpaperImgWrapper";
import Bio from "../pannels/Bio";

const MyProfile = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const profileId = props.firebaseAuth.uid;

  const {
    users
    , firebaseProfile
  } = props;

  const {
    firstname
    , lastname
    , profileImgURL
    , wallpaperImgURL
    , bio
    , friends: profileFriendsUids
  } = firebaseProfile;

  return isLoaded(firebaseProfile)
    ? (
        <div className="container large profile">
          
          <WallpaperImgWrapper
            profileImgURL={ profileImgURL }
            wallpaperImgURL={ wallpaperImgURL }
          />
          <ProfileBtns type="edit"/>
          <p className="txt-center profile-name ">{`${firstname} ${lastname}`}</p>
          <div className="profile-btm-wrapper owl-stacker-2">
            <div className="profile-left owl-stacker-2">
              <Bio text={ bio } />
              {
                isLoaded(users)
                  ? <FriendsBoard
                      profileFriendsUids={ profileFriendsUids }
                      users={ users }
                      isMyProfile={ true }
                      myUid={ profileId }
                      profileId={ profileId }
                    />
                  : <div className="loading-circle"></div>
              }
            </div>
            <section className="pannel-posts-wrapper">
              <PostPannel/>
              <h3 className="txt-center">My Posts:</h3>
              <OwnPosts
                history={props.history}
                profileId={ profileId }
                isMyPost={ true }
                myUid={ profileId }
                firstname = { firstname }
                lastname = { lastname }
                profileImgURL={ profileImgURL }
                wallpaperImgURL={ wallpaperImgURL }
              />
            </section>
          </div>
        </div>
      )
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

export default compose(
  connect(mapStateToProps)
  , firestoreConnect([{ collection: "users" }])
)(MyProfile);