import React, { Component } from "react";
import { render } from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "../styles/main.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  componentDidMount() {
    fetch("api/events")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.data.map(event => {
          event.id = event.event_id;
          event.title = event.name;
          console.log(event.start);
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          console.log(event.start);
        })}
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={this.state.data}
        />
      </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
