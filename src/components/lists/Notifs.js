import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import Notif from "../pannels/Notif";
// FUNCTIONS
import spreadObj from "../../myPlugins/functions/spreadObj";
import filterAndSortDate from '../../myPlugins/functions/filterAndSortDate';
// CONSTANTS
import deletedUser from '../../myPlugins/constants/deletedUser';

const Notifs = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const { users, notifs }=props;

  return (
    isLoaded(notifs)
      ? isEmpty(notifs)
        ? <div>No Notifications Yet!</div>
        : isLoaded(users)
          ? (
              <div className="container large">
                <div className="results-list-wrapper">
                  <h2>Notifications</h2>
                  <ul className="results-list container med">
                    {
                      filterAndSortDate(spreadObj(notifs, { withId: true }))
                      .map((notif) => {

                        const {
                          ownerId
                          , postOwnerId
                          , postId
                          , type
                          , createdAt
                          , id
                        }=notif;
                
                        const {
                          firstname
                          , lastname
                          , profileImgURL
                        }=users[ownerId] || deletedUser;// if user got DELETED

                        return (
                          <Notif
                            key={ id }
                            ownerLink={ `/profile/${ownerId}` }
                            postLink={ `/post/${postOwnerId}/${postId}` }
                            firstname={ firstname }
                            lastname={ lastname }
                            profileImgURL = { profileImgURL }
                            type = { type }
                            createdAt = { createdAt }
                          />
                        );
                      })
                    }
                  </ul>
                </div>
              </div>
            )
          : <div className="loading-circle"></div>
      : <div className="loading-circle"></div>
  );
}

const mapStateToProps = (state) => {

  const { users, notifs } = state.firestore.data;

  return {
    firebaseAuth: state.firebase.auth
    , users
    , notifs
    , firestoreCollections: state.firestore.data
  }
}

export default compose(
  connect(mapStateToProps)
  , firestoreConnect((props) => {

      return props.firebaseAuth.uid // to prevent error
        ? ([
            { collection: "users" },
            { 
              collection: "notifications"
              , doc: props.firebaseAuth.uid
              , subcollections: [{ collection: "notifs" }]
              , storeAs: "notifs"
            }
          ])
        : []
  })
)(Notifs);