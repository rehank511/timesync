import React, { Component } from "react";
import { render } from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "@fortawesome/fontawesome-free/js/all.js";

import "../styles/main.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
      modal: false,
      event: {
        title: "",
        extendedProps: {
          description: ""
        }
      }
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

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleEventClick = ({ event, el }) => {
    this.toggle();
    this.setState({ event });
  };

  handleEventDelete = () => {
    fetch(`api/events/${this.state.event.id}`,
      {
        method: "DELETE"
      }).then(response => {
        if (response.status < 300) {
          this.toggle();
          this.state.event.remove();
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.data.map(event => {
          event.id = event.event_id;
          event.title = event.name;
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        })}
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, bootstrapPlugin]}
          themeSystem="bootstrap"
          events={this.state.data}
          eventClick={this.handleEventClick}
        />
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.state.event.title}</ModalHeader>
          <ModalBody>
            {this.state.event.extendedProps.description}
          </ModalBody>
          <ModalFooter>
            <Button className="mr-auto" color="danger" onClick={this.handleEventDelete}>Delete</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
