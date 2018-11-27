import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
  </div>
);

class SignInFormBase extends Component {
  state = { error: null };

  onSubmit = event => {
    event.preventDefault();
    this.props.firebase
      .signInWithGithub()
      .then(authUser => {
        console.log(authUser);
        this.props.history.push(ROUTES.HOME);
        // this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        console.log("error:", error);
        this.setState({ error });
      });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In</button>
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignInPage;
