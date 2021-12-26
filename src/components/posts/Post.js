import React from 'react';
import { Link } from "react-router-dom";
import { isEmpty } from "react-redux-firebase";
import Moment from 'moment';
// COMPONENTS
import UserLink from "../pannels/UserLink";
import ImgSlider from "../pannels/ImgSlider";
// FUNCTIONS
import breakText from "../../myPlugins/functions/breakText";
import cleanHtml from "../../myPlugins/functions/cleanHtml";

const Post = (props) => {

  const {
    commentsCount
    , createdAt
    , deletePost
    , imgs
    , likes
    , myUid
    , notListItem
    , ownerFirstname
    , ownerId
    , ownerLastname
    , ownerLink
    , postId
    , profileImgURL
    , text
    , toggleLike
  } = props;

  const likedByMe = () => {
    // to check if the current user has already liked the post or not
    return likes && likes.includes(myUid);
  }
  
  const postChilds = (
    <div className="post-childs-wrapper owl-stacker-2">
      <UserLink
        ownerLink = { ownerLink }
        firstname = { ownerFirstname }
        lastname = { ownerLastname }
        profileImgURL = { profileImgURL }
        deletePost = { deletePost }
      />
      { <p className="txt-op" dangerouslySetInnerHTML={{__html: cleanHtml(breakText(text))}}></p> }
      {/* To check for images if there are any */}
      { !isEmpty(imgs)
        && 
        <ImgSlider imgs={ imgs }/>
      }
      <div className="post-details txt-small">
        <span>
          { `${ likes.length } like${ /[01]/.test(likes.length) ? "" : "s" }, ` }
          {
            commentsCount
              ? <Link
                  className = "underline"
                  to={`/post/${ownerId}/${postId}`}
                >{commentsCount} comment{ commentsCount === 1 ? "" : "s" }.</Link>
              : "No comments yet."
          }
        </span>
        <span>{ Moment(createdAt.toDate()).calendar() }</span>
      </div>
      {/* btns exception below */}
      <div className="btns-wrapper stretcher">
        <button
          onClick={ toggleLike.bind(this, { myUid, postId, postOwnerId: ownerId, liked: likedByMe() ? true : false }) }
          className={`btn${ likedByMe() ? " liked" : "" }`}
        >
            <i className="fas fa-thumbs-up"></i>Like
        </button>
        <Link to={`/post/${ownerId}/${postId}`} className="btn"><i className="fas fa-comment"></i>Comment</Link>
      </div>
    </div>
  );

  return (
    notListItem
      // done below for semantics, because in <PostWall>, Post is no longer an <li> but a <div>
      ? <div className="post">{ postChilds }</div>
      : <li className="post">{ postChilds }</li>
  );
}

export default Post;