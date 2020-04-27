import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Header from "../layout/Header";

import "../../styles/login.scss";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: this.state.email,
      password: this.state.password,
    };
    this.props.login(user);
  };

  componentDidMount() {
    document.title = "Login | TimeSync";
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <Fragment>
        <Header />
        <div className="container">
          <div className="signin text-center">
            <Form onSubmit={this.onSubmit}>
              <h1 className="h3">Login</h1>
              <Input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                autoFocus
                value={this.state.email}
                onChange={(e) => {
                  this.setState({
                    email: e.target.value,
                  });
                }}
              />
              <Input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                value={this.state.password}
                onChange={(e) => {
                  this.setState({
                    password: e.target.value,
                  });
                }}
              />
              <Button type="submit" color="primary">
                Login
              </Button>
            </Form>
            <p className="text-left">
              Don't have an account? <Link to="/signup">Sign up.</Link>
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
