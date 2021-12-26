import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import { v4 as uuidv4 } from "uuid";
// COMPONENTS
import ImgLoaderWrapper from "./ImgLoaderWrapper";
// ACTIONS
import { imgUpload } from "../../store/actions/imgActions";
import { postCreate } from "../../store/actions/postActions";
import { showModal } from "../../store/actions/modalActions";

class PostPannel extends Component {
  
  state = {
    postText: ""
    , postId: uuidv4()
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { uid } = this.props.firebaseAuth;
    const profile = this.props.firebaseProfile;

    const { imgState } = this.props;
    const allImgsComplete = imgState.imgsUploading ? imgState.imgsUploading.every(img => img.complete === true) : true;
    const imgsToSubmit = imgState.imgsUploading.map((img) => ({ name: img.name, order: img.order, url: img.url, id: img.id }));
    const postToSubmit = ({ 
      id: this.state.postId
      , ownerId: uid
      , text: this.state.postText
      , imgs: imgsToSubmit
      , ownerFirstname: profile.firstname
      , ownerLastname: profile.lastname 
    });

    if (allImgsComplete && this.state.postText) {
      this.props.postCreate({post: postToSubmit});
      // below to clear imgs
      this.props.clearImgsState();
      this.setState(() => ({ postText: "", postId: uuidv4() }));
    } else if (!allImgsComplete) {
      const modalContent = "Please wait for Images to finish uploading..."
      this.props.showModal(modalContent);
    } else if (!this.state.postText) {
      const modalContent = "You have to write something in order to post it."
      this.props.showModal(modalContent);
    }
  }

  render() {

    const { imgState } = this.props;

    return (
      <form onSubmit={ this.handleSubmit } className="post-pannel">
        <div className="post-pannel-ctrl">
          <p className="txt-large">Share Something:</p>
          <div className="btns-wrapper min">
            <div className="img-upload-wrapper">
              <label htmlFor="imgUpload" className="btn img-upload">
              </label>
              {/* <!-- make sure to accept imgs only --> */}
              <input
                onChange={ this.props.imgUpload.bind(this, this.state.postId) }
                id="imgUpload"
                type="file"
                accept="image/*"
              />
            </div>
            <button className="btn submit">post</button>
          </div>
        </div>
        <textarea
          onChange={ this.handleChange }
          value={ this.state.postText }
          name="postText"
          className="post-pannel-input"
          minLength="3"
        />
        { !isEmpty(imgState.imgsUploading) && <ImgLoaderWrapper imgState={ imgState } /> }
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { img, post, firebase } = state;
  
  return ({
    imgState: img
    , postState: post
    , firebaseAuth: firebase.auth
    , firebaseProfile: firebase.profile
  });
}

const mapDispatchToProps = (dispatch) => ({
  imgUpload: (postId, e) => dispatch(imgUpload({ postId, img: e.target.files[0] }))
  , postCreate: (post) => dispatch(postCreate(post))
  , showModal: (content) => dispatch(showModal(content))
  , clearImgsState: () => dispatch({ type: "CLEAR_IMG_STATE" })
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPannel);