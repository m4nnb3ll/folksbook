import React from 'react';
import { Link } from "react-router-dom";
// FUNCTIONS
import sortMixAlpha from "../../myPlugins/functions/sortMixAlpha";
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const Friend = (props) => {
  const {
    myUid
    , friendId
    , firstname
    , lastname
    , profileImgURL
    , online
    , isMyProfile
    , inScroll
  } = props;

  return (
      <li
        className={ inScroll ? "scroll-list-item" : `friend`}
        style={{ backgroundImage: imgBgURL(profileImgURL) }}
      >
        <Link to={`/profile/${friendId}`}>
          <p className="on-bg-txt txt-large">
            { (isMyProfile && online) && <i className="online-circle fas fa-circle"></i> }
            { firstname } { lastname }
          </p>
        </Link>
        {
          isMyProfile
            ? <div className="btns-wrapper">
                <Link 
                  to={ `/convo/${sortMixAlpha(myUid, friendId)}` }
                  className="btn"><i className="fas fa-envelope"></i>Message
                </Link>
              </div>
            : null
        }
      </li>
    );
}

export default Friend;