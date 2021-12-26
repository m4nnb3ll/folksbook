import React from 'react';
import { Link } from "react-router-dom";
import Moment from "moment";
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const Notif = (props) => {

  const {
    firstname
    , lastname
    , ownerLink
    , postLink
    , profileImgURL
    , type
    , createdAt
    , clearNotifs
  } = props;

  const actions = {
    "CREATE": "created a new post!"
    , "LIKE": "liked your post!"
    , "COMMENT": "commented on your post!"
    , "FRIEND_REQ": "accepted your friend request!"
  }

  return (
    <li className="tool-list-item with-timestamp container med">
      <div
        className="notif-link"
      >
        <Link
          style={{ backgroundImage: imgBgURL(profileImgURL) }}
          className="link-img"
          to={ ownerLink }
        ></Link>
        <Link
          to={ type === "FRIEND_REQ" ? ownerLink : postLink }
          className="notif-txt"
          onClick={ clearNotifs ? clearNotifs.bind(this, "notifs") : ()=>{} }
        >{ `${firstname} ${lastname} ${actions[type]}` }</Link>
        <p className="timestamp txt-small">{Moment(createdAt.toDate()).calendar()}</p>
      </div>
    </li>
  )
}

export default Notif;