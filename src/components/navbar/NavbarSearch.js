import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { isEmpty } from 'react-redux-firebase';
// COMPONENTS
import UserBtnsSetter from "../buttons/UserBtnsSetter";
import UserLink from "../pannels/UserLink";
// FUNCTIONS
import findUser from "../../myPlugins/functions/findUser";
import escapeRegExp from "../../ex_plugins/functions/escapeRegExp";

class NavbarSearch extends Component {

  state = {
    who: ""
  }

  handleChange = (e) => { this.setState({[e.target.name]: e.target.value}); }

  render() {
    
    const {
      users
      , selectNavTab
      , selectedNavTab
      , myUid
      , sendFriendReq
      , cancelFriendReq
      , acceptFriendReq
      , rejectFriendReq
      , firebaseProfile: myProfile
    } = this.props;

    const { sentReqs, receivedReqs, friends } = myProfile;
    
    const searchResults = findUser(users, escapeRegExp(this.state.who) );

    return (
      <li
        
        className={`nav-tool search${selectedNavTab === "search" ? " active" : ""}`}
      >
        <div
          onClick={ selectNavTab.bind(this,"search") }
          className="nav-tool-icon"
        ><i className="fas fa-search"></i></div>
        <div className="tool-list-wrapper">
          <div className="search-input-wrapper">
            <input
              onFocus={
                selectedNavTab === "search"
                  ? null
                  : selectNavTab.bind(this,"search")
              }
              onChange={ this.handleChange }
              value={ this.state.who }
              type="text"
              name="who"
            />
          </div>
          {
            !isEmpty(searchResults) && (
              <div className="tool-list">
                <div className="shadow-scroll nav">
                  <ul className="tool-list-items">
                    {
                      searchResults.map((user) => {
                        
                        const {
                          id: userId
                          , firstname
                          , lastname
                          , profileImgURL
                        }=user;

                        return Object.keys(user).length === 1 // incase user got deleted, and only the id is left in the "user" obj
                          ? null
                          : (
                              <li key={ userId } className="tool-list-item container med">
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
                            )
                      })
                    }
                  </ul>
                </div>
                <Link
                  to={`/search-results/${ this.state.who ? this.state.who : "empty" }`}
                  className="btn full-width"
                >Show all results</Link>
              </div>
            )
          }
        </div>
      </li>
    )
  }
}

export default NavbarSearch;