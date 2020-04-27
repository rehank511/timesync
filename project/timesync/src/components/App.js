import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import PrivateRoute from "./common/PrivateRoute";

import { loadUser } from "../actions/auth";
import Home from "./home/Home";
import Calendar from "./calendar/Calendar";
import Login from "./account/Login";
import Register from "./account/Register";
import "../styles/main.scss";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Register} />
            <Route exact path="/:calendar" component={Calendar} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
