import React from 'react'
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Link } from "react-router-dom";
// COMPONENTS
import Notif from "../pannels/Notif";
// FUNCTIONS
import filterAndSortDate from "../../myPlugins/functions/filterAndSortDate";
import spreadObj from "../../myPlugins/functions/spreadObj";
// CONSTANTS
import deletedUser from '../../myPlugins/constants/deletedUser';

const NavbarNotifs = (props) => {

  const handleClick = () => {
    selectNavTab("notifs");
    // if user exits the notifs nav tab
    (selectedNavTab === "notifs") && clearNotifs("notifs");
  }

  const {
    selectedNavTab
    , selectNavTab
    , clearNotifs
    , users
    , notifs
    , firebaseProfile
  }=props;

  const { notifs: notifsIds } = firebaseProfile;

  return (
    <li
      
      className={`nav-tool${selectedNavTab === "notifs" ? " active" : ""}`}
    >
      <div
        onClick={ handleClick }
        className="nav-tool-icon"
      >
        <i
          className="fas fa-bell"
          // style below, because mobile browser doesn't change "content" of pseudo-element until refresh
          style={{
            "--count": (notifsIds && notifsIds.length) ? `"${notifsIds.length}"`: `""`
            , "--counter-bg": (notifsIds && notifsIds.length) ? "var(--second-color)" : "inherit"
          }}
        ></i>
      </div>
      <div className="tool-list-wrapper">
        <div className="tool-list">
          <div className="shadow-scroll nav">
            <ul className="tool-list-items">
              {
                isLoaded(notifsIds)
                  ? isEmpty(notifsIds)
                    ? <div>No New Notifications Yet...</div>
                    : isLoaded(notifs)
                      ? isLoaded(users)
                        ? filterAndSortDate(spreadObj(notifs, { withId: true }))
                          .map((notif) => {
                            const {
                              ownerId
                              , postId
                              , type
                              , postOwnerId
                              , createdAt
                              , id
                            }=notif;
                            
                            if (!notif.ownerId) return null;
                            
                            const {
                              firstname
                              , lastname
                              , profileImgURL
                            }= users[ownerId] || deletedUser;
          
                            return !isEmpty(notif)
                              ? (
                                  <Notif
                                    key={ id }
                                    ownerLink={ `/profile/${ownerId}` }
                                    postLink={ `/post/${postOwnerId}/${postId}` }
                                    firstname={ firstname }
                                    lastname={ lastname }
                                    profileImgURL = { profileImgURL }
                                    type = { type }
                                    createdAt = { createdAt }
                                    clearNotifs={ clearNotifs }
                                  />
                                )
                              : null
                          })
                        : <div className="loading-circle"></div>
                      : <div className="loading-circle"></div>
                  : <div className="loading-circle"></div>
              }
            </ul>
          </div>
          <Link
            to="/notifs"
            className="btn full-width"
            onClick={ clearNotifs.bind(this, "notifs") }
          >Show all notifications</Link>
        </div>
      </div>
    </li>
  )
}

export default NavbarNotifs;