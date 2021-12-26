import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
// COMPONENTS
import ExploreItem from "../pannels/ExploreItem";
// ACTIONS
import { sendFriendReq, cancelFriendReq } from "../../store/actions/friendsActions";
// FUNCTIONS
import getObjKeys from "../../myPlugins/functions/getObjKeys";

class ExploreFolks extends Component {

  state = {
    dismissedIds: []
  };

  dismissUser = (userId) => {
    this.setState(state => ({ dismissedIds:  [...state.dismissedIds, userId]}));
  }

  render() {
    const { dismissedIds } = this.state;
    const {
      firebaseProfile
      , firebaseAuth
      , users
      , sendFriendReq
      , cancelFriendReq
    } = this.props;

    const myUid = firebaseAuth.uid;
    const { friends, sentReqs, receivedReqs } = firebaseProfile;
    
    const usersIds = getObjKeys(users);

    // if the user is not dismissed and not a friend
    const folksToExplore = usersIds && usersIds.filter((userId) => {
      return (
        userId !== myUid // not me
        && !dismissedIds.includes(userId) // and not dismissed
        && (friends ? !friends.includes(userId) : true) // and not a friend
        && (isEmpty(receivedReqs) || !receivedReqs.includes(userId)) // and not requesting friendship
      );
    });

    return isLoaded(folksToExplore)
      ? isEmpty(folksToExplore)
        ? null
        : (
            <section className="scroll-list-wrapper">
              <h3>Explore Folks:</h3>
              <div className="shadow-scroll dynamic">
                <ul className="scroll-list">
                  {
                    folksToExplore
                    .map((userId) => {
                      
                      return (
                        <ExploreItem
                          key = { userId }
                          user = { { ...users[userId], id: userId } }
                          sendFriendReq = { sendFriendReq }
                          cancelFriendReq = { cancelFriendReq }
                          reqPending={ sentReqs && sentReqs.includes(userId) }
                          dismissUser = { this.dismissUser }
                        />
                      );
                    })
                  }
                </ul>
              </div>
            </section>
          )
      : <div className="loading-circle"></div>
  }
}

const mapStateToProps = (state) => {
  const { auth, profile } = state.firebase;
  const { users } = state.firestore.data;

  return {
    firebaseAuth: auth
    , firebaseProfile: profile
    , users
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendFriendReq: (userId) => dispatch(sendFriendReq(userId) )
  , cancelFriendReq: (userId) => dispatch(cancelFriendReq(userId))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect([{ collection: "users" }])
)(ExploreFolks);