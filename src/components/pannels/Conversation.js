import React, { Component, createRef } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import Moment from "moment";
// COMPONENTS
import ConvoTop from "./ConvoTop";
import MsgPannel from './MsgPannel';
import ImgSlider from "./ImgSlider";
// FUNCTIONS
import breakText from "../../myPlugins/functions/breakText";
import cleanHtml from "../../myPlugins/functions/cleanHtml";

class Conversation extends Component {
  
  convoBottom = createRef();

  scrollToConvoBottom = () => {
    this.convoBottom.current && this.convoBottom.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  componentDidMount() {
    this.scrollToConvoBottom();
  }

  componentDidUpdate() {
    this.scrollToConvoBottom();
  }

  render(){

    if(!this.props.firebaseAuth.uid) return <Redirect to="/"/>;

    const {
      firebaseAuth
      , firebaseProfile
      , match
      , msgs
      , friendData
    } = this.props;
    
    const convoId = match.params.id;
    const myUid = firebaseAuth.uid;

    const notMyFriend = () => {
      const otherId = convoId.replace(myUid, "");
      // "isLoaded" below to prevent "undefined" error
      return isLoaded(firebaseProfile && firebaseProfile.friends) && !firebaseProfile.friends.includes(otherId);
    }

    if(!firebaseAuth.uid || notMyFriend()) return <Redirect to="/"/>;

    const friendId = convoId.replace(myUid, "");

    return (
      <div className="container med">
        <div className="convo-wrapper">
          {
            isLoaded(friendId && friendData)
              ? <ConvoTop
                  friendData = { friendData }
                  friendId = { friendId }
                />
              : <div className="loading-circle"></div>
          }
          <div className="convo owl-stacker-2">
            {
              isLoaded(msgs)
                ? isEmpty(msgs)
                  ? <div>No messages yet!</div>
                  : msgs.map((msg) => {
                      return (
                        <div key={msg.id} className={`msg-bubble txt-op${msg.ownerId === myUid ? " mine" :""}`}>
                          { <p dangerouslySetInnerHTML={{__html: cleanHtml(breakText(msg.text))}}></p> }
                          {/* To check for images if there are any */}
                          { !isEmpty(msg.imgs)
                            && 
                            <ImgSlider imgs={ msg.imgs }/>
                          }
                          <span className="timestamp txt-small">{ Moment(msg.createdAt.toDate()).calendar() }</span>
                        </div>
                      );
                    })
                : <div className="loading-circle"></div>
            }
            <div className="convo-btm" ref={ this.convoBottom }></div>
          </div>
          <MsgPannel convoId={convoId}/>
        </div>
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  const { auth, profile } = state.firebase;
  
  const { convo, friendData } = state.firestore.data;

  return {
    firebaseAuth: auth
    , firebaseProfile: profile
    , msgs: isLoaded(convo) && convo.msgs
    , friendData
  }
}

export default compose(
  connect(mapStateToProps)
  , firestoreConnect((props) => {
    const myUid = props.firebaseAuth.uid;
    const convoId = props.match.params.id;
    const friendId = convoId.replace(myUid, "");

    return (
      [
        {
          collection: "convos"
          , doc: convoId
          , storeAs: "convo"
        },
        {
          collection: "users"
          , doc: friendId
          , storeAs: "friendData"
        }
      ]
    );
  })
)(Conversation);