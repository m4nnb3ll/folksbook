import React from 'react';
import { Link } from "react-router-dom";
// COMPONENTS
import UserBtns from "../buttons/UserBtns";
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const ExploreItem = (props) => {

  const {
    sendFriendReq
    , cancelFriendReq
    , reqPending
    , dismissUser
    , user
  } = props;
  
  const {
    profileImgURL
    , firstname
    , lastname
    , id
  } = user;

  return user
    ? (
        <li 
          className={`scroll-list-item`}
          style={{ backgroundImage: imgBgURL(profileImgURL) }}
        >
          <Link to = { `profile/${ id }` } >
            <p className="on-bg-txt txt-large">{ firstname } { lastname }</p>
          </Link>
          <UserBtns
            cancelFriendReq = { cancelFriendReq.bind(this, id) }
            sendFriendReq = { sendFriendReq.bind(this, id) }
            dismissUser = { dismissUser.bind(this, id) }
            type = { reqPending ? "sent" : null }
          />
        </li>
      )
    : null
}

export default ExploreItem;