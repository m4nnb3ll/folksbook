import React from 'react';
import { Link } from "react-router-dom";

const ProfileBtns = (props) => {

  /**
   * edit
   * sent
   * received
   * friend
   * normal
   */

  switch( props.type ) {
    case "edit"
    : {
      return (
        <div className="profile-btns">
          <Link to="/edit-myprofile" className="btn">
            <i className="fas fa-pen"></i>Edit profile
          </Link>
        </div>
      );
    }
    case "sent"
    : {
      return (
        <div className="profile-btns">
          <button onClick={ props.cancelFriendReq } className="btn">
            <i className="fas fa-user-clock"></i>Pending...
          </button>
        </div>
      );
    }
    case "received"
    : {
      return (
        <div className="profile-btns">
          <button onClick={ props.rejectFriendReq } className="btn">
            <i className="fas fa-user-times"></i>Reject
          </button>
          <button onClick={ props.acceptFriendReq } className="btn">
            <i className="fas fa-user-check"></i>Accept
          </button>
        </div>
      );
    }
    case "friend"
    : {
      return (
        <div className="profile-btns">
          <Link to={ props.convoLink } className="btn">
            <i className="fas fa-envelope"></i>Message
          </Link>
          <button onClick={ props.unfriend } className="btn">
            <i className="fas fa-user-minus"></i>Unfriend
          </button>
        </div>
      );
    }
    default
    : {
      return (
        <div className="profile-btns">
          <button onClick={ props.sendFriendReq } className="btn">
            <i className="fas fa-user-plus"></i>Add
          </button>
        </div>
      );
    }
  }
}

export default ProfileBtns;