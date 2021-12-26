import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
// COMPONENTS
import UserBtnsSetter from "../buttons/UserBtnsSetter";
import UserLink from "../pannels/UserLink";
// ACTIONS
import { rejectFriendReq, acceptFriendReq, sendFriendReq, cancelFriendReq } from "../../store/actions/friendsActions";
// FUNCTIONS
import findUser from "../../myPlugins/functions/findUser";

const SearchResults = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const {
    users
    , match
    , cancelFriendReq
    , acceptFriendReq
    , rejectFriendReq
    , sendFriendReq
    , firebaseProfile: myProfile
    , firebaseAuth
  } = props;
  const myUid = firebaseAuth.uid;
  const { sentReqs, receivedReqs, friends } = myProfile;
  
  const who = match.params.who;
  const searchResults = findUser(users, who);

  return (
    <div className="container large">
      <div className="results-list-wrapper">
        <h2>Search results</h2>
        {
          isLoaded(searchResults)
            ? <ul className="results-list container med">
                {
                  who !== "empty"
                    ? !isEmpty(searchResults)
                      ? searchResults.map((user) => {
                        
                          const {
                            firstname
                            , lastname
                            , profileImgURL
                            , id: userId
                          } = user;

                          return (
                            <li key={userId} className="tool-list-item">
                              <UserLink
                                ownerLink = { `/profile/${userId}` }
                                firstname = { firstname }
                                lastname = { lastname }
                                profileImgURL = { profileImgURL }
                              />
                              <UserBtnsSetter
                                myUid = { myUid }
                                userId = { userId }
                                sentReqs = { sentReqs }
                                receivedReqs = { receivedReqs }
                                friends = { friends }
                                cancelFriendReq = { cancelFriendReq }
                                acceptFriendReq = { acceptFriendReq }
                                rejectFriendReq = { rejectFriendReq }
                                sendFriendReq = { sendFriendReq }
                              />
                            </li>
                          );
                        })
                      : <div>No users were found...</div>
                    : <div>Nothing to search for.</div>
                }
              </ul>
            : <div className="loading-circle"></div>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  firebaseAuth: state.firebase.auth
  , firebaseProfile: state.firebase.profile
  , users: state.firestore.data.users
});

const mapDispatchToProps = (dispatch) => ({
  sendFriendReq: (userId) => dispatch(sendFriendReq(userId) )
  , cancelFriendReq: (userId) => dispatch(cancelFriendReq(userId))
  , acceptFriendReq: (userId) => dispatch(acceptFriendReq(userId))
  , rejectFriendReq: (userId) => dispatch(rejectFriendReq(userId))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect([{ collection: "users" }])
)(SearchResults);