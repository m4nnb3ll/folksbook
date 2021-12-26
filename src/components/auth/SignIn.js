import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
// ACTIONS
import { signIn } from "../../store/actions/authActions";

class SignIn extends Component {

  state = {
    email: ""
    , password: ""
    , loading: false
  }

  handleChange = (e) => {
    this.state.loading && this.setState({ loading: false });
    this.setState({ [e.target.id]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { clearError, signIn } = this.props;
    clearError("CLEAR_SIGN_IN_ERROR");
    signIn(this.state);
    this.setState({ loading: true });
  }

  render() {
    if(this.props.firebaseAuth.uid) return <Redirect to="/home"/>;

    return (
      <div className="container large">
        <form onSubmit={ this.handleSubmit } className="board edit-details">
            <h3 className="title">Sign In:</h3>
            {/* <!-- email --> */}
            <div className="edit-detail">
              <label htmlFor="email">Email:</label>
              <input onChange={ this.handleChange } type="email" id="email" required />
            </div>
            {/* <!-- password --> */}
            <div className="edit-detail">
              <label htmlFor="password">Password:</label>
              <input onChange={ this.handleChange } type="password" id="password" required />
            </div>
            {/* <!-- submit button --> */}
            <button className="btn">
              Sign In
              { this.state.loading && <div className="loading-circle inline"></div> }
            </button>
            { this.props.signInErr && <p className="error">{ this.props.signInErr }</p> }
          </form>
      </div>
    );
  }
}

const mapStateToProps = ({ firebase, auth }) => ({
  firebaseAuth: firebase.auth
  , signInErr: auth.signInErr
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (userCreds) => dispatch(signIn(userCreds))
  , clearError: (type) => dispatch({ type })
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);