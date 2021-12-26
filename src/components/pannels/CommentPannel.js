import React, { Component } from 'react';
import { v4 as uuidv4 } from "uuid";

class CommentPannel extends Component {
  
  state = {
    commentText: ""
    , commentId: uuidv4()
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { commentId, commentText } = this.state;
    const {
      firebaseProfile: profile
      , myUid
      , postOwnerId
      , postId
      , createComment
    } = this.props;
    
    const commentToSubmit = ({ 
      id: commentId
      , ownerId: myUid
      , postOwnerId: postOwnerId
      , postId: postId
      , text: commentText
      , ownerFirstname: profile.firstname
      , ownerLastname: profile.lastname
      , createdAt: new Date()
    });

    commentText
      ? (()=>{
        createComment(commentToSubmit);
        this.setState(() => ({ commentText: "", commentId: uuidv4() }));
      })()
      : this.props.showModal("The comment is empty!")
  }

  render() {

    return (
      <form onSubmit={ this.handleSubmit } className="post-pannel">
        <div className="post-pannel-ctrl">
          <p className="txt-large">Write a Comment:</p>
          <div className="pannel-ctrl-btns">
            <button className="btn submit">Comment</button>
          </div>
        </div>
        <textarea
          onChange={ this.handleChange }
          value={ this.state.commentText }
          name="commentText"
          className="post-pannel-input"
        ></textarea>
      </form>
    );
  }
}

export default CommentPannel;