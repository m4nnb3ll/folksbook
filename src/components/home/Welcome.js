import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
// ACTIONS
import { signIn } from "../../store/actions/authActions";
// CONSTANTS
import { darkLogo } from "../../myPlugins/constants/links";
import { guestEmail, guestPassword } from "../../myPlugins/constants/guest";

class Welcome extends Component {

  state = {
    loading: false
  }

  handleGuestSignIn = () => {
    const { clearError, signIn } = this.props;
    clearError("CLEAR_SIGN_IN_ERROR");
    signIn({
      email: guestEmail
      , password: guestPassword
    });
    this.setState({ loading: true });
  }

  render() {

    if(this.props.firebaseAuth.uid) return <Redirect to="/home"/>;

    const { signInErr } = this.props;

    return (
      <div className="container small welcome owl-stacker-3">
        <img className="block-center" src={ darkLogo } alt="FolksBook"/>
        <h2 className="txt-center">Hello visiter, welcome to FolksBook:</h2>
        <p>Folksbook is a social media app, designed and built with high quality, to accomodate the best experience possible to the user.</p>
        <div className="dialogue">
          <p>If It is your first time here, and only want to explore and see what the  app is like, you're very welcome as a Guest!</p>
          <button
            onClick={ this.handleGuestSignIn }
            className="btn full-width"
          >
            <i className="fas fa-user-tie"></i> Guest?!
            { this.state.loading && <div className="loading-circle inline"></div> }
          </button>
          { signInErr && <p className="error">{ signInErr }</p> }
        </div>
        <div className="dialogue">
          <p>Do you want to have your own account? Sign Up!</p>
          <Link to="/signup" className="btn">Sign Up <i className="left fas fa-user-edit"></i></Link>
        </div>
        <div className="dialogue">
          <p>Or you already have an account? Sign In!</p>
          <Link to="/signin" className="btn">Sign In <i className="left fas fa-sign-in-alt"></i></Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  firebaseAuth: state.firebase.auth
  , signInErr: state.auth.signInErr
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (userCreds) => dispatch(signIn(userCreds))
  , clearError: (type) => dispatch({ type })
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);