import React from 'react';
import { Link } from "react-router-dom";
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const UserLink = (props) => {

  const {
    ownerLink
    , firstname
    , lastname
    , profileImgURL
    , text
    , center
    , deletePost
    , deleteComment
  } = props;

  return (
    <div className={`user-link${center ? " fcenter" : ""}`}>
      <Link
        to={ ownerLink }
        className="link-img"
        style={{ backgroundImage: imgBgURL(profileImgURL) }}
      ></Link>
      <Link
        to={ ownerLink }
        className={ `user-txt${ center ? " center" : ""}` }
      >
        <p className={ `txt-large${ center ? " txt-center" : ""}` }>{`${ firstname } ${ lastname }`}</p>
        { text && <span>{ text }</span> }
      </Link>
      { deletePost && <button className="trash btn danger" onClick={ deletePost }><i className="fas fa-trash"></i></button> }
      { deleteComment && <button  className="trash btn danger" onClick={ deleteComment }><i className="fas fa-trash"></i></button> }
    </div>
  )
}

export default UserLink;