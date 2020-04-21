import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";

import "../../styles/nav.scss";

class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const authLinks = (
      <Nav>
        <NavItem>
          <Link to="/calendar" className="nav-link">
            Home
          </Link>
        </NavItem>
        <NavItem>
          <NavLink href="#logout" onClick={this.props.logout}>
            Logout
          </NavLink>
        </NavItem>
      </Nav>
    );

    const guestLinks = (
      <Nav>
        <NavItem>
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </NavItem>
      </Nav>
    );

    return (
      <Navbar className="bg-light">
        <NavbarBrand color="light">
          <img
            src="/static/timesync/img/logo.png"
            className="d-inline-block align-top"
            alt="brand"
          />
          TimeSync
        </NavbarBrand>
        {this.props.auth.isAuthenticated ? authLinks : guestLinks}
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
