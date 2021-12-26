import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';
import { v4 as uuidv4 } from "uuid";
// COMPONENTS
import ImgLoaderWrapper from "./ImgLoaderWrapper";
// ACTIONS
import { imgUpload } from "../../store/actions/imgActions";
import { msgCreate } from "../../store/actions/msgActions";
import { showModal } from "../../store/actions/modalActions";

class MsgPannel extends Component {
  
  state = {
    msgText: ""
    , msgId: uuidv4()
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { msgId, msgText } = this.state;
    const { uid } = this.props.firebaseAuth;

    const { imgState } = this.props;
    const allImgsComplete = imgState.imgsUploading ? imgState.imgsUploading.every(img => img.complete === true) : true;
    const imgsToSubmit = imgState.imgsUploading.map((img) => ({name: img.name, order: img.order, url: img.url, id: img.id}));
    const msgToSubmit = ({ 
      id: msgId
      , ownerId: uid
      , text: msgText
      , imgs: imgsToSubmit
    });

    if (allImgsComplete) {
      this.props.msgCreate({msg: msgToSubmit, convoId: this.props.convoId});
      // below to clear imgs
      this.props.clearImgsState();
    } else {
      const modalContent = "Please wait for Images to finish uploading..."
      this.props.showModal(modalContent);
    }

    this.setState(() => ({ msgText: "", msgId: uuidv4() }));
  }

  render() {

    const { imgState } = this.props;

    return (
      <form onSubmit={ this.handleSubmit } className="post-pannel">
        <div className="post-pannel-ctrl">
          <p className="txt-large">Write a message:</p>
          <div className="btns-wrapper min">
            <div className="img-upload-wrapper">
              <label htmlFor="imgUpload" className="btn img-upload"></label>
              <input
                onChange={ this.props.imgUpload.bind(this, this.state.msgId) }
                id="imgUpload"
                type="file"
                accept="image/*"
              />
            </div>
            <button className="btn submit">send</button>
          </div>
        </div>
        <textarea onChange={ this.handleChange } value={ this.state.msgText } name="msgText" className="post-pannel-input" minLength="3" ></textarea>
        { !isEmpty(imgState.imgsUploading) && <ImgLoaderWrapper imgState={ imgState } /> }
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { img, msg, firebase } = state;
  return ({
    imgState: img
    , msgState: msg
    , firebaseAuth: firebase.auth
  });
}

const mapDispatchToProps = (dispatch) => {
  return ({
    imgUpload: (msgId, e) => dispatch(imgUpload({ msgId, img: e.target.files[0] }))
    , msgCreate: (msgObj) => dispatch(msgCreate(msgObj))
    , showModal: (content) => dispatch(showModal(content))
    , clearImgsState: () => dispatch({ type: "CLEAR_IMG_STATE" })
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(MsgPannel);