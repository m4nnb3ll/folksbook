import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import Msg from "../pannels/Msg";
// FUNCTIONS
import spreadObj from "../../myPlugins/functions/spreadObj";
import filterAndSortDate from '../../myPlugins/functions/filterAndSortDate';
// CONSTANTS
import deletedUser from "../../myPlugins/constants/deletedUser";

const Msgs = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const {
    users
    , msgNotifs
  }=props;

  return (
    isLoaded(msgNotifs)
      ? isEmpty(msgNotifs)
        ? <div>No Conversations Yet!</div>
        : isLoaded(users)
          ? (
              <div className="container large">
                <div className="results-list-wrapper">
                  <h2>Messages</h2>
                  <ul className="results-list container med txt-op">
                    {
                      filterAndSortDate(spreadObj(msgNotifs, { withId: true }))
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
                        }=users[ownerId] || deletedUser;// incase user is deleted
                
                        return (
                          <Msg
                            key={ convoId }
                            firstname = { firstname }
                            lastname = { lastname }
                            ownerId = { ownerId }
                            profileImgURL = { profileImgURL }
                            convoId = { convoId }
                            createdAt = { createdAt }
                            text = { text }
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

  // to prevent error of "_ref is undefined"
  const { users, msgNotifs } = isLoaded(state.firestore.data) && state.firestore.data;

  return {
    firebaseAuth: state.firebase.auth
    , users
    , msgNotifs
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
              , subcollections: [{ collection: "msgNotifs" }]
              , storeAs: "msgNotifs"
            }
          ])
        : []
  })
)(Msgs);