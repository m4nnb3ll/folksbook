import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import ScrollToTop from "./ex_plugins/components/ScrollToTop";
// components
import Welcome from "./components/home/Welcome";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import MyProfile from "./components/profiles/MyProfile";
import EditMyProfile from "./components/profiles/EditMyProfile";
import Profile from "./components/profiles/Profile";
import FriendRequests from "./components/lists/FriendRequests";
import Msgs from "./components/lists/Msgs";
import Notifs from "./components/lists/Notifs";
import SearchResults from "./components/lists/SearchResults";
import Conversation from './components/pannels/Conversation';
import PostWall from './components/posts/PostWall';
import Modal from "./components/pannels/Modal";
import NotFound from "./components/special/NotFound";
import Friends from "./components/lists/Friends";

const App = () => {
  return (
    <HashRouter>
      <div>
        <Navbar/>
        <ScrollToTop>
          <Switch>
            <Route exact path="/" component={ Welcome } />
            <Route path="/signin" component={ SignIn } />
            <Route path="/signup" component={ SignUp } />
            <Route path="/home" component={ Home } />
            <Route path="/myprofile" component={ MyProfile } />
            <Route path="/profile/:id" component={ Profile } />
            <Route path="/friends/:profileId" component={ Friends } />
            <Route path="/friend-requests" component={ FriendRequests } />
            <Route path="/msgs" component={ Msgs } />
            <Route path="/notifs" component={ Notifs } />
            <Route path="/search-results/:who" component={ SearchResults } />
            <Route path="/convo/:id" component={ Conversation } />
            <Route path="/edit-myprofile" component={ EditMyProfile } />
            <Route path="/post/:postOwnerId/:postId" component={ PostWall } />
            {/* Below is to handle 404 requests */}
            <Route component={ NotFound } />
          </Switch>
        </ScrollToTop>
        <Modal/>
      </div>
    </HashRouter>
  )
}

export default App;