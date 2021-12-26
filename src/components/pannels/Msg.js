import React from 'react';
import { Link } from "react-router-dom";
import Moment from "moment";
// COMPONENTS
import UserLink from "./UserLink";

const Msg = (props) => {
  const {
    firstname
    , lastname
    , ownerId
    , profileImgURL
    , convoId
    , createdAt
    , text
    , clearNotifs
  } = props;

  return (
    <li className="tool-list-item with-timestamp container med">
      <UserLink
        ownerLink = { `/profile/${ownerId}` }
        firstname = { firstname }
        lastname = { lastname }
        profileImgURL = { profileImgURL }
      />
      <p className="timestamp txt-small">{Moment(createdAt.toDate()).calendar()}</p>
      <Link
        to={`/convo/${convoId}`}
        className="msg txt-op"
        onClick={ clearNotifs ? clearNotifs.bind(this, "msgNotifs") : ()=>{} }
      >{ text.length > 45 ? `${text.slice(0, 45)}...` : text }</Link>
    </li>
  )
}

export default Msg;