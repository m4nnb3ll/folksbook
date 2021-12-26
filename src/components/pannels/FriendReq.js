import React from 'react';
// COMPONENTS
import UserLink from "../pannels/UserLink";
import UserBtns from "../buttons/UserBtns";

const FriendReq = (props) => {
  
  const {
    ownerLink
    , ownerId
    , firstname
    , lastname
    , profileImgURL
    , acceptFriendReq
    , rejectFriendReq
  } = props;

  return (
    <li className="tool-list-item container med">
      <UserLink
        ownerLink = { ownerLink }
        firstname = { firstname }
        lastname = { lastname }
        profileImgURL = { profileImgURL }
      />
      <UserBtns
        acceptFriendReq = { acceptFriendReq.bind(this, ownerId) }
        rejectFriendReq = { rejectFriendReq.bind(this, ownerId) }
        type = "received"
      />
    </li>
  )
}

export default FriendReq;