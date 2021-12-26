import React from 'react';
// COMPONENTS
import UserLink from "../pannels/UserLink";

const NavbarHamburger = (props) => {

  const {
    firebaseProfile
    , selectNavTab
    , selectedNavTab
    , signOut
  } = props;

  const {
    firstname
    , lastname
    , profileImgURL
  } = firebaseProfile;

  return (
    <li
      
      className={`nav-tool hamburger${selectedNavTab === "hamburger" ? " active" : ""}`}
    >
      <div
        onClick={ selectNavTab.bind(this, "hamburger") }
        className="nav-tool-icon"
      ><i className="fas fa-bars"></i></div>
      <div className="tool-list-wrapper">
        <div className="tool-list-item">
          <UserLink
            ownerLink = { `/myprofile` }
            firstname = { firstname }
            lastname = { lastname }
            profileImgURL = { profileImgURL }
            text = { `View your profile` }
            center = { true }
          />
        </div>
        {/* <!-- sign out button --> */}
        <button onClick={ signOut } className="btn full-width">
          <i className="fas fa-sign-out-alt"></i>Sign Out
        </button>
      </div>
    </li>
  )
}

export default NavbarHamburger;