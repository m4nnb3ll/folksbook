import React from 'react'
import { Link } from "react-router-dom";
import { isEmpty, isLoaded } from 'react-redux-firebase';
// COMPONENTS
import Msg from "../pannels/Msg";
// FUNCTIONS
import filterAndSortDate from "../../myPlugins/functions/filterAndSortDate";
import spreadObj from "../../myPlugins/functions/spreadObj";
// CONSTANTS
import deletedUser from "../../myPlugins/constants/deletedUser";

const NavbarMsgs = (props) => {

  const {
    selectedNavTab
    , selectNavTab
    , clearNotifs
    , users
    , msgNotifs
    , firebaseProfile
  }=props;

  const { msgNotifs: msgNotifsIds } = firebaseProfile;

  const handleClick = () => {
    selectNavTab("msgs");
    // if user exits the notifs nav tab
    (selectedNavTab === "msgs") && clearNotifs("msgNotifs");
  }

  return (
    <li className={`nav-tool${selectedNavTab === "msgs" ? " active" : ""}`}>
      <div
        onClick={ handleClick }
        className="nav-tool-icon"
      >
        <i
          className="fas fa-envelope"
          // style below, because mobile browser doesn't change "content" of pseudo-element until refresh
          style={{
            "--count": (msgNotifsIds && msgNotifsIds.length) ? `"${msgNotifsIds.length}"`: `""`
            , "--counter-bg": (msgNotifsIds && msgNotifsIds.length) ? "var(--second-color)" : "inherit"
          }}
        ></i>
      </div>
      <div className="tool-list-wrapper">
        <div className="tool-list">
          <div className="shadow-scroll nav">
            <ul className="tool-list-items">
            
              {
                isLoaded(msgNotifsIds)
                  ? isEmpty(msgNotifsIds)
                    ? <div>No New Messages Yet...</div>
                    : isLoaded(msgNotifs)
                      ? isLoaded(users)
                        ? filterAndSortDate(spreadObj(msgNotifs, { withId: true }))
                          .map((msgNotif) => {
                              const {
                                ownerId
                                , createdAt
                                , id: convoId
                                , text
                              }=msgNotif;
                              
                              const {
                                firstname
                                , lastname
                                , profileImgURL
                              }= users[ownerId] || deletedUser;
            
                              return !isEmpty(msgNotif)
                                ? (
                                  <Msg
                                    key={ convoId }
                                    firstname={ firstname }
                                    lastname={ lastname }
                                    ownerId={ ownerId }
                                    profileImgURL={ profileImgURL }
                                    convoId={ convoId }
                                    createdAt={ createdAt }
                                    text={ text }
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
            to="/msgs"
            className="btn full-width"
            onClick={ clearNotifs.bind(this, "msgNotifs") }
          >Show all conversations</Link>
        </div>
      </div>
    </li>
  )
}

export default NavbarMsgs;