import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isLoaded } from "react-redux-firebase";
import { Redirect } from 'react-router-dom';
// COMPONENTS
import WallpaperImgWrapper from './WallpaperImgWrapper';
// ACTIONS
import { profileImgUpload } from "../../store/actions/imgActions";
import { showModal } from "../../store/actions/modalActions";
import { editMyProfile, deleteMyAccount } from "../../store/actions/editProfileActions";
// CONSTANTS
import { guestId } from '../../myPlugins/constants/guest';

class EditMyProfile extends Component {

  state = {
    firstname: ""
    , lastname: ""
    , bio: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { imgsUploading, editMyProfile, showModal, history } = this.props;

    const { profile, wallpaper } = imgsUploading;

    if (profile.complete && wallpaper.complete) {
      this.setState({ firstname: "", lastname: "", bio: "" });
      const nothingChanged = Object.values(this.state).every(val => !val);
      // to editMyProfile only if something has changed
      !nothingChanged && editMyProfile(this.state);
      history.push("/myprofile");
    } else {
      const modalContent = "Please wait for Images to finish uploading..."
      showModal(modalContent);
    }

  }

  handleAccountDelete = (e) => {
    e.preventDefault();

    const { deleteMyAccount, showModal, firebaseAuth } = this.props;

    if(firebaseAuth.uid===guestId) {
      const modalContent = "You can't delete the Guest Account!"
      showModal(modalContent);
    } else {
      const modalContent = "You are about to delete your account!"
      showModal(modalContent, { danger: true, sideFunction: deleteMyAccount, choice: true });
    }

  }

  render() {

    if(!this.props.firebaseAuth.uid) return <Redirect to="/"/>;

    const {
      imgsUploading
      , profileImgUpload
      , firebaseProfile
      , deleteUserErr
      , clearDelUsrErr
      , showModal
    } = this.props;

    if (deleteUserErr) showModal(deleteUserErr, { sideFunction: clearDelUsrErr })

    const {
      profileImgURL
      , wallpaperImgURL
    } = firebaseProfile;

    const { profile: profileImg, wallpaper } = imgsUploading;

    return isLoaded(firebaseProfile)
      ? (
          <div className="container large profile">
              <WallpaperImgWrapper
                profileImgURL = { (profileImg && profileImg.url) ? profileImg.url : profileImgURL }
                wallpaperImgURL = { (wallpaper && wallpaper.url) ? wallpaper.url : wallpaperImgURL }
                profileImgPercent = { profileImg ? profileImg.percent : 0 }
                wallpaperPercent = { wallpaper ? wallpaper.percent : 0 }
                profileImgUpload = { profileImgUpload }
              />
              <p className="txt-center profile-name edit">{`${firebaseProfile.firstname} ${firebaseProfile.lastname}`}</p>
              <div className="container small owl-stacker-1">
                <form onSubmit={this.handleSubmit} className="board edit-details">
                  <h3 className="title">Edit your details:<span className="notice">(empty fields will be ignored)</span></h3>
                  {/* <!-- firstname --> */}
                  <div className="edit-detail">
                    <label htmlFor="firstname">First Name:</label>
                    <input minLength="3" onChange={ this.handleChange } name="firstname" id="firstname" type="text"/>
                  </div>
                  {/* <!-- lastname --> */}
                  <div className="edit-detail">
                    <label htmlFor="lastname">Last Name:</label>
                    <input minLength="3" onChange={ this.handleChange } name="lastname" id="lastname" type="text"/>
                  </div>
                  {/* <!-- bio --> */}
                  <div className="edit-detail">
                    <label htmlFor="bio">Change Bio:</label>
                    <textarea minLength="3" onChange={ this.handleChange } name="bio" id="bio" type="text"></textarea>
                  </div>
                  <button className="btn round-corners full-width">Submit changes</button>
                </form>
                <button
                  className="btn danger"
                  onClick={ this.handleAccountDelete }
                >
                  <i className="fas fa-trash"></i>delete my account
                </button>
              </div>
          </div>
        )
      : <div className="loading-circle"></div>
  }
}

const mapStateToProps = (state) => {
  const { auth, profile } = state.firebase;
  const { imgsUploading, deleteUserErr } = state.editProfile;
  
  return ({
    firebaseAuth: auth
    , firebaseProfile: profile
    , imgsUploading
    , deleteUserErr
  });
}

const mapDispatchToProps = (dispatch) => ({
  profileImgUpload: (imgType, e) => dispatch(profileImgUpload({imgType, img: e.target.files[0]}))
  , editMyProfile: (details) => dispatch(editMyProfile(details))
  , showModal: (content, params) => dispatch(showModal(content, params))
  , deleteMyAccount: () => dispatch(deleteMyAccount())
  , clearDelUsrErr: () => dispatch({type: "CLEAR_DELETE_USER_ERROR"})
});

export default connect(mapStateToProps, mapDispatchToProps)(EditMyProfile);