import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
// ACTIONS
import { signUp } from "../../store/actions/authActions";

class SignUp extends Component {

  state = {
    email: ""
    , password: ""
    , firstname: ""
    , lastname: ""
    , loading: false
  }

  handleChange = (e) => {
    this.state.loading && this.setState({ loading: false });
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { clearError, signUp } = this.props;
    clearError("CLEAR_SIGN_UP_ERROR")
    signUp(this.state);
    this.setState({ loading: true });
  }

  render() {
    if(this.props.firebaseAuth.uid) return <Redirect to="/home"/>;

    return (
      <div className="container large">
        <form onSubmit={ this.handleSubmit } className="board edit-details">
            <h3 className="title">Sign up:</h3>
            {/* <!-- firstname --> */}
            <div className="edit-detail">
              <label htmlFor="firstname">First Name:</label>
              <input onChange={ this.handleChange } minLength="3" type="text" id="firstname" required />
            </div>
            {/* <!-- lastname --> */}
            <div className="edit-detail">
              <label htmlFor="lastname">Last Name:</label>
              <input onChange={ this.handleChange } minLength="3" type="text" id="lastname" required />
            </div>
            {/* <!-- email --> */}
            <div className="edit-detail">
              <label htmlFor="email">Email:</label>
              <input onChange={ this.handleChange } type="email" id="email" required />
            </div>
            {/* <!-- password --> */}
            <div className="edit-detail">
              <label htmlFor="password">Password:</label>
              <input onChange={ this.handleChange } minLength="6" type="password" id="password" required />
            </div>
            {/* <!-- submit button --> */}
            <button className="btn">
              Sign Up
              { this.state.loading && <div className="loading-circle inline"></div> }
            </button>
            { this.props.signUpErr && <p className="error">{this.props.signUpErr}</p> }
          </form>
      </div>
    );
  };
}

const mapStateToProps = ({ firebase, auth }) => ({
  firebaseAuth: firebase.auth
  , signUpErr: auth.signUpErr
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (newUser) => dispatch(signUp(newUser))
  , clearError: (type) => dispatch({ type })
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);