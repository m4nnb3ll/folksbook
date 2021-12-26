import React from 'react';
import { Link } from "react-router-dom";

const UserBtns = (props) => {

  /**
   * sent
   * received
   * friend
   * normal
   */

  const {
    acceptFriendReq
    , cancelFriendReq
    , convoLink
    , rejectFriendReq
    , sendFriendReq
    , dismissUser
    , type
  } = props;

  switch( type ) {
    case "sent"
    : {
      return (
        <div className="btns-wrapper stretcher">
          <button onClick={ cancelFriendReq } className="btn">
            <i className="fas fa-user-clock"></i>Pending...
          </button>
          { dismissUser && <button onClick={ dismissUser } className="btn">Dismiss</button> }
        </div>
      );
    }
    case "received"
    : {
      return (
        <div className="btns-wrapper stretcher">
          <button onClick={ rejectFriendReq } className="btn">
            <i className="fas fa-user-times"></i>Reject
          </button>
          <button onClick={ acceptFriendReq } className="btn">
            <i className="fas fa-user-check"></i>Accept
          </button>
        </div>
      );
    }
    case "friend"
    : {
      return (
        <div className="btns-wrapper stretcher">
          <Link to = { convoLink } className = "btn">
            <i className="fas fa-envelope"></i>Message
          </Link>
        </div>
      );
    }
    default
    : {
      return (
        <div className="btns-wrapper stretcher">
          <button onClick={ sendFriendReq } className="btn"><i className="fas fa-user-plus"></i>Add</button>
          { dismissUser && <button onClick={ dismissUser } className="btn">Dismiss</button> }
        </div>
      );
    }
  }
}

export default UserBtns;