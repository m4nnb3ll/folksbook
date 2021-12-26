import React from 'react';
import { Link } from "react-router-dom";
import { isEmpty, isLoaded } from "react-redux-firebase";
// COMPONENTS
import FriendReq from "../pannels/FriendReq";

const NavbarFriendReqs = (props) => {

  const {
    users
    , selectedNavTab
    , selectNavTab
    ,  cleanReceivedReqs
    , firebaseProfile
    , acceptFriendReq
    , rejectFriendReq
  } = props;

  const { receivedReqs } = firebaseProfile;
  
  return (
    <li
      
      className={`nav-tool${selectedNavTab === "friends" ? " active" : ""}`}
    >
      <div
        onClick={ selectNavTab.bind(this, "friends") }
        className="nav-tool-icon"
      >
        <i
          className="fas fa-user-friends"
          // style below, because mobile browser doesn't change "content" of pseudo-element until refresh
          style={{
            "--count": (receivedReqs && receivedReqs.length) ? `"${receivedReqs.length}"`: `""`
            , "--counter-bg": (receivedReqs && receivedReqs.length) ? "var(--second-color)" : "inherit"
          }}
        ></i>
      </div>
      <div className="tool-list-wrapper">
        <div className="tool-list">
          <div className="shadow-scroll nav">
            <ul className="tool-list-items">
              {
                isLoaded(users)
                  ? isEmpty(receivedReqs)
                    ? <div>No Friend Requests Yet...</div>
                    : receivedReqs.map((ownerId) => {
                        
                        if(!users[ownerId]) {
                          cleanReceivedReqs(ownerId);
                          return null;
                        }

                        const {
                          firstname
                          , lastname
                          , profileImgURL
                        }=users[ownerId];
      
                        return (
                          <FriendReq
                            key={ ownerId }
                            ownerLink={ `/profile/${ownerId}` }
                            ownerId={ ownerId }
                            firstname={ firstname }
                            lastname={ lastname }
                            profileImgURL={ profileImgURL }
                            acceptFriendReq={ acceptFriendReq }
                            rejectFriendReq={ rejectFriendReq }
                          />
                        );
                      })
                  : <div className="loading-circle"></div>
              }
            </ul>
          </div>
          <Link
            to="/friend-requests"
            className="btn full-width"
          >Show all requests</Link>
        </div>
      </div>
    </li>
  )
}

export default NavbarFriendReqs;