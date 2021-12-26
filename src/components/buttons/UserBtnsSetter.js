import React from 'react';
// COMPONENTS
import UserBtns from "./UserBtns";
// FUNCTIONS
import sortMixAlpha from "../../myPlugins/functions/sortMixAlpha";

const UserBtnsSetter = (props) => {
  const {
    sentReqs
    , receivedReqs
    , friends
    , myUid
    , userId
    , cancelFriendReq
    , acceptFriendReq
    , rejectFriendReq
    , sendFriendReq
  } = props;

  return (
    <div>
      {
        sentReqs && sentReqs.includes(userId)
          ? <UserBtns
              type="sent"
              cancelFriendReq={ cancelFriendReq && cancelFriendReq.bind(this, userId) }
            />
          : receivedReqs && receivedReqs.includes(userId)
            ? <UserBtns
                type="received"
                acceptFriendReq={ acceptFriendReq && acceptFriendReq.bind(this, userId) }
                rejectFriendReq={ rejectFriendReq && rejectFriendReq.bind(this, userId) }
              />
            : friends && friends.includes(userId)
              ? <UserBtns 
                  type="friend"
                  convoLink={ `/convo/${sortMixAlpha(myUid, userId)}` }
                />
              : myUid === userId
                ? null
                : <UserBtns sendFriendReq={ sendFriendReq && sendFriendReq.bind(this, userId) }/>
      }
    </div>
  )
}

export default UserBtnsSetter;