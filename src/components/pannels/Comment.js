import React from 'react';
import Moment from 'moment';
// COMPONENTS
import UserLink from "./UserLink";
// FUNCTIONS
import breakText from "../../myPlugins/functions/breakText";
import cleanHtml from "../../myPlugins/functions/cleanHtml";
// CONSTANTS
import deletedUser from '../../myPlugins/constants/deletedUser';

const Comment = (props) => {

  const {
    user
    , comment
    , deleteComment
  }=props;

  const {
    ownerId
    , createdAt
    , text
  }=comment;

  const {
    firstname
    , lastname
    , profileImgURL
  }=user || deletedUser;

  return (
    <li className="comment owl-stacker-2">

      <UserLink
        ownerLink = { `/profile/${ownerId}` }
        firstname = { firstname }
        lastname = { lastname }
        profileImgURL = { profileImgURL }
        deleteComment = { deleteComment }
      />
      { <p className="txt-op" dangerouslySetInnerHTML={{__html: cleanHtml(breakText(text))}}></p> }
      <p className="timestamp txt-small">{Moment(createdAt.toDate()).calendar()}</p>
    </li>
  )
}

export default Comment;