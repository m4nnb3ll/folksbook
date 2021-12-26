import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
// COMPONENTS
import NavbarFriendReqs from "./NavbarFriendReqs";
import NavbarSearch from "./NavbarSearch";
import NavbarNotifs from "./NavbarNotifs";
import NavbarHamburger from "./NavbarHamburger";
import NavbarMsgs from "./NavbarMsgs";
// ACTIONS
import { signOut } from "../../store/actions/authActions";
import { selectNavTab, clearNotifs, cleanReceivedReqs } from "../../store/actions/navTabsActions";
import { rejectFriendReq, acceptFriendReq, sendFriendReq, cancelFriendReq } from "../../store/actions/friendsActions";

const Navbar = (props) => {
  if (!props.firebaseAuth.uid) return null;

  const {
    firebaseAuth
    , firebaseProfile
    , selectedNavTab
    , selectNavTab
    , clearNotifs
    , cleanReceivedReqs
    , signOut
    , location
    , routeChangeInterruption
    , users
    , notifs
    , msgNotifs
    , sendFriendReq
    , cancelFriendReq
    , acceptFriendReq
    , rejectFriendReq
  } = props;

  // to listen on change of the url and clear the img state if upload left undone
  window.addEventListener("popstate", (e) => {
    routeChangeInterruption();
    // to remove ".active" from the selected navtab
    selectNavTab();
  });

  // To control the ".active" of the "home" tab
  (location === "home" && !selectedNavTab) && selectNavTab("home");

  return (isLoaded(users) && !isEmpty(users))
    ? (
        <nav className="navbar">
          <ul className="nav-tools">
            <div className="container large">
            {/* <!-- home --> */}
            <Link
              to="/home"
              className={ `nav-tool${ selectedNavTab === "home" ? " active" : "" }` }
            >
              <div
                onClick={ selectNavTab.bind(this, "home") }
                className="nav-tool-icon"
              ><i className="fas fa-home"></i></div>
            </Link>
            {/* <!-- search --> */}
            <NavbarSearch
              users={ users }
              selectedNavTab={ selectedNavTab }
              selectNavTab={ selectNavTab }
              firebaseProfile={ firebaseProfile }
              myUid={ firebaseAuth.uid }
              sendFriendReq={ sendFriendReq }
              cancelFriendReq={ cancelFriendReq }
              acceptFriendReq={ acceptFriendReq }
              rejectFriendReq={ rejectFriendReq }
            />
            {/* <!-- friend-requests --> */}
            <NavbarFriendReqs
              firebaseProfile = { firebaseProfile }
              selectedNavTab={ selectedNavTab }
              selectNavTab={ selectNavTab }
              cleanReceivedReqs={ cleanReceivedReqs }
              users={ users }
              acceptFriendReq={ acceptFriendReq }
              rejectFriendReq={ rejectFriendReq }
            />
            {/* <!-- messages --> */}
            <NavbarMsgs
              firebaseProfile = { firebaseProfile }
              selectedNavTab = { selectedNavTab }
              selectNavTab = { selectNavTab }
              clearNotifs = { clearNotifs }
              users = { users }
              msgNotifs = { msgNotifs }
            />
            {/* <!-- notifications --> */}
            <NavbarNotifs
              firebaseProfile = { firebaseProfile }
              selectedNavTab = { selectedNavTab }
              selectNavTab = { selectNavTab }
              clearNotifs = { clearNotifs }
              users = { users }
              notifs = { notifs }
            />
            {/* <!-- hamburger --> */}
            <NavbarHamburger
              firebaseProfile = { firebaseProfile }
              selectedNavTab={ selectedNavTab }
              selectNavTab={ selectNavTab }
              signOut = { signOut }
              users = { users }
            />
            </div>
          </ul>
        </nav>
      )
    : <div className="loading-circle"></div>
}

const mapStateToProps = (state) => {

  const {
    firebase
    , firestore
    , location
    , navTab
  }=state;
  

  const { auth, profile }=firebase;

  const {
    users
    , notifications
  }=firestore.data;

  const {
    // didn't use storeAs below in firestoreConnect
    // , because i am applying a map to bring only notifs needed
    notifs
    , msgNotifs
    // *LOOK BELOW IN "isLoaded"* "&&" incase "auth.uid" is "undefined", and "notifications[auth.uid]"
    // to avoid "_ref is undefined" error when changing accounts on same page
    // , because i think firestoreConnect reserves the state and does not clear it
  }=isLoaded(notifications && auth.uid && notifications[auth.uid]) && notifications[auth.uid];

  return ({
    firebaseAuth: auth
    , firebaseProfile: profile
    , selectedNavTab: navTab.selectedNavTab
    , location
    , users
    , notifs
    , msgNotifs
  });
}

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut())
  , selectNavTab: (navTab) => dispatch(selectNavTab(navTab))
  , clearNotifs: (notifsType) => dispatch(clearNotifs(notifsType))
  , cleanReceivedReqs: (uidToRemove) => dispatch(cleanReceivedReqs(uidToRemove))
  , routeChangeInterruption: () => dispatch({ type: "ROUTE_CHANGE_INTERRUPTION"})
  , sendFriendReq: (userId) => dispatch(sendFriendReq(userId) )
  , cancelFriendReq: (userId) => dispatch(cancelFriendReq(userId))
  , acceptFriendReq: (userId) => dispatch(acceptFriendReq(userId))
  , rejectFriendReq: (userId) => dispatch(rejectFriendReq(userId))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect((props) => {
      const { firebaseAuth, firebaseProfile } = props;
      const { notifs: notifsIds, msgNotifs: msgNotifsIds } = firebaseProfile;

      const notifsToFetch = (
        !isEmpty(notifsIds)
          ? notifsIds.map((notifId) => {
              return ({
                collection: "notifications"
                , doc: firebaseAuth.uid
                , subcollections: [{
                    collection: "notifs"
                    , doc: notifId
                }]
              });
            })
          : []
      );

      const msgNotifsToFetch = (
        !isEmpty(msgNotifsIds)
          ? msgNotifsIds.map((msgNotifId) => {
              return ({
                collection: "notifications"
                , doc: firebaseAuth.uid
                , subcollections: [{
                    collection: "msgNotifs"
                    , doc: msgNotifId
                }]
              });
            })
          : []
      );

      return firebaseAuth.uid // to prevent error
        ? ([
            { collection: "users" }
            , ...notifsToFetch
            , ...msgNotifsToFetch
          ])
        : []
  })
)(Navbar);