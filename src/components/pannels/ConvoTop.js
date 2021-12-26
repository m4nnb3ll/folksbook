import React from 'react';
import { Link } from "react-router-dom";
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const ConvoTop = ({ friendData, friendId }) => {

  const { online, firstname, lastname, profileImgURL } = friendData;

  return (
    <div className="convo-top">
      <Link
        to={ `/profile/${ friendId }` }
        className="link-img"
        style={{ backgroundImage: imgBgURL(profileImgURL) }}
      ></Link>
      { online && <i className="online-circle fas fa-circle"></i> }
      <Link to={ `/profile/${ friendId }` } className="user-txt">
        <p className="txt-large">{`${ firstname } ${ lastname }`}</p>
      </Link>
    </div>
  )
}

export default ConvoTop;