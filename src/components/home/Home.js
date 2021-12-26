import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// COMPONENTS
import PostPannel from "../pannels/PostPannel";
import HomePosts from "../posts/HomePosts";
import ExploreFolks from "../lists/ExploreFolks";

const Home = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;
  
  return (
    <main className="main">
      <div className="container large">
        <ExploreFolks/>
        <section className="pannel-posts-wrapper">
          <PostPannel/>
          <HomePosts history={ props.history }/>
        </section>
      </div>
    </main>
  );
}

const mapStateToProps = (state) => ({ firebaseAuth: state.firebase.auth });

const mapDispatchToProps = (dispatch) => ({ resetMyProfile: (myUid) => dispatch(resetMyProfile(myUid)) });

export default connect(mapStateToProps, mapDispatchToProps)(Home);