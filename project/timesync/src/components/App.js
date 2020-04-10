import React, { Component } from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import store from "../store";

import Calendar from "./calendar/Calendar";

import "../styles/main.scss";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Calendar />
      </Provider>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
