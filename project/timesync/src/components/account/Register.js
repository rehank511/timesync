import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Input, Button } from "reactstrap";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';

import "../../styles/signup.scss";

class Register extends Component {
    state = {
        first: "",
        last: "",
        email: "",
        password: "",
        confirm: ""
    }

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    onSubmit = e => {
        e.preventDefault();
        if (this.state.password !== this.state.confirm) {
            console.log("passwords do not match");
            return;
        }
        const user = {
            username: this.state.email,
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.first,
            last_name: this.state.last
        };
        this.props.register(user);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        return (
            <div className="container">
                <div className="signup text-center">
                    <Form onSubmit={this.onSubmit}>
                        <h1 className="h3">Create your account</h1>
                        <Input type="text" className="form-control" placeholder="First Name" required autoFocus
                            value={this.state.first}
                            onChange={e => {
                                this.setState({
                                    first: e.target.value
                                });
                            }} />
                        <Input type="text" className="form-control" placeholder="Last Name" required
                            value={this.state.last}
                            onChange={e => {
                                this.setState({
                                    last: e.target.value
                                });
                            }} />
                        <Input type="email" className="form-control" placeholder="Email" required
                            value={this.state.email}
                            onChange={e => {
                                this.setState({
                                    email: e.target.value
                                });
                            }} />
                        <Input type="password" className="form-control" placeholder="Password" required
                            value={this.state.password}
                            onChange={e => {
                                this.setState({
                                    password: e.target.value
                                });
                            }} />
                        <Input type="password" className="form-control" placeholder="Confirm Password" required
                            value={this.state.confirm}
                            onChange={e => {
                                this.setState({
                                    confirm: e.target.value
                                });
                            }} />
                        <Button type="submit" color="primary">Create Account</Button>
                    </Form>
                    <p className="text-left">Already have an account? <Link to="/login">Login.</Link></p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);