import React from 'react';
import { Link } from "react-router-dom";
import { isEmpty } from 'react-redux-firebase';
// COMPONENTS
import Friend from "../pannels/Friend";

const FriendsBoard = (props) => {
  
  const {
    profileFriendsUids
    , users
    , isMyProfile
    , myUid
    , profileId
  }=props;

  const friends = isEmpty(profileFriendsUids)
      ? []
      // To make sure users is not null
      : users && profileFriendsUids
        .map((friendId) => ({friendId, ...users[friendId]}))
        // if my profile, filter offline out
        .filter((friend) => isMyProfile ? friend.online : true )
        // if my profile, keep all friends(which are online), else limit to 3
        .slice(0, isMyProfile ? profileFriendsUids.length : 3)

  return (
    <div className="board friends-wrapper">
      <h3 className="title">
        {
         isMyProfile
          ? <span>
              <i className="online-circle fas fa-circle"></i>
              <span>Online friends:</span>
            </span>
          : <span>Friends:</span>
        }
      </h3>
      {
        isEmpty(friends)
          ? <div>{ isMyProfile ? "No Online Friends." : "This user has no friends." }</div>
          : (
              <div className="shadow-scroll dynamic">
                <ul className="scroll-list">
                  {
                    friends.map((friend) => {
        
                      const {
                        friendId
                        , firstname
                        , lastname
                        , profileImgURL
                        , online
                      }=friend;
          
                      return (
                        <Friend
                          key = { friendId }
                          myUid = { myUid }
                          friendId = { friendId }
                          isMyProfile = { myUid === profileId }
                          profileImgURL = { profileImgURL }
                          online = { online  }
                          firstname = { firstname }
                          lastname = { lastname  }
                          inScroll = { true  }
                        />
                      );
                    })
                  }
                </ul>
              </div>
          )
      }
      <Link to={ `/friends/${profileId}` } className="btn stretcher">View all friends</Link>
    </div>
  );

}

export default FriendsBoard;