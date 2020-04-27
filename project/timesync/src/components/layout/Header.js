import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "../../styles/nav.scss";

const Brand = (props) => {
  if (props.calendar) {
    return (
      <NavItem>
        <Link to="/" className="brand">
          <img
            src="/static/timesync/img/logo.png"
            className="d-inline-block align-top"
            alt="brand"
          />
          TimeSync
        </Link>
        <span className="brand-username">@{props.calendar}</span>
      </NavItem>
    );
  } else {
    return (
      <NavItem>
        <Link to="/" className="brand">
          <img
            src="/static/timesync/img/logo.png"
            className="d-inline-block align-top"
            alt="brand"
          />
          TimeSync
        </Link>
      </NavItem>
    );
  }
};

class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const authLinks = (
      <Nav>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Syncs
          </DropdownToggle>
          <DropdownMenu right>
            {this.props.auth.user ? (
              this.props.auth.user.friends.map((friend) => {
                return (
                  <Link
                    to={`/${friend.calendar.username}`}
                    className="profile-link"
                  >
                    <DropdownItem>
                      {`@${friend.calendar.username}`}
                    </DropdownItem>
                  </Link>
                );
              })
            ) : (
              <DropdownItem />
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
        <NavItem>
          <Link
            to={`/${
              this.props.history.location.pathname == "/"
                ? this.props.auth.user
                  ? this.props.auth.user.calendar.username
                  : ""
                : ""
            }`}
            className="nav-link"
          >
            {this.props.history.location.pathname == "/" ? "Profile" : "Home"}
          </Link>
        </NavItem>
        <NavItem>
          <NavLink href="" onClick={this.props.logout}>
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
        <Nav>
          <Brand calendar={this.props.match.params.calendar} />
        </Nav>
        {this.props.auth.isAuthenticated ? authLinks : guestLinks}
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(withRouter(Header));
