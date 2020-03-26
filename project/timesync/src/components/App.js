import React, { Component } from "react";
import { render } from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import bootstrapPlugin from "@fullcalendar/bootstrap";
import interactionPlugin from "@fullcalendar/interaction"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import "@fortawesome/fontawesome-free/js/all.js";

import "../styles/main.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loaded: false,
      placeholder: "Loading",
      editModal: false,
      createModal: false,
      event: {
        title: "",
        start: "",
        end: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        extendedProps: {
          location: "",
          description: ""
        }
      },
      newEvent: {
        title: "",
        start: "",
        end: "",
        extendedProps: {
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          location: "",
          description: ""
        }
      }
    };
  }

  componentDidMount() {
    fetch("api/events/")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(events => {
        this.setState(() => {
          return {
            events,
            loaded: true
          };
        });
      });
  }

  toggleEditModal = () => {
    this.setState({ editModal: !this.state.editModal });
  };

  handleEventClick = ({ event, el }) => {
    if (event.start.length === 0) {
      event.startDate = "";
      event.startTime = "";
    } else {
      let date = new Date(event.start)
      date = new Date(date - (date.getTimezoneOffset() * 60000)).toISOString();
      event.startDate = date.substring(0, 10);
      event.startTime = date.substring(11, 16);
    }
    if (event.end.length === 0) {
      event.endDate = "";
      event.endTime = "";
    } else {
      let date = new Date(event.end);
      date = new Date(date - (date.getTimezoneOffset() * 60000)).toISOString();
      event.endDate = date.substring(0, 10);
      event.endTime = date.substring(11, 16);
    }
    this.setState({ event });
    this.toggleEditModal();
  };

  handleEventDelete = () => {
    fetch(`api/events/${this.state.event.id}`,
      {
        method: "DELETE"
      }).then(response => {
        if (response.status < 300) {
          this.state.event.remove();
          this.state.events = this.state.events.filter(event => event.id != this.state.event.id);
          this.toggleEditModal();
        }
      });
  }

  toggleCreateModal = () => {
    this.setState({ createModal: !this.state.createModal });
  };

  handleDateClick = (info) => {
    this.state.newEvent.extendedProps.startDate = info.dateStr;
    this.state.newEvent.extendedProps.endDate = info.dateStr;
    this.toggleCreateModal();
  }

  handleEventCreate = () => {
    let event = {
      calendar_id: 1,
      title: this.state.newEvent.title,
      location: this.state.newEvent.extendedProps.location,
      start: this.state.newEvent.start,
      end: this.state.newEvent.end,
      description: this.state.newEvent.extendedProps.description
    }
    fetch("api/events/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    }).then(response => {
      if (response.status > 400) {
        return this.setState(() => {
          return { placeholder: "Something went wrong!" };
        });
      }
      return response.json();
    }).then((event) => {
      event.id = event.event_id;
      this.setState({
        events: this.state.events.concat(event)
      });
      this.toggleCreateModal();
    });
  }

  render() {
    return (
      <div>
        {this.state.events.map(event => {
          event.id = event.event_id;
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        })}
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin, interactionPlugin]}
          themeSystem="bootstrap"
          events={this.state.events}
          eventClick={this.handleEventClick}
          dateClick={this.handleDateClick}
        />

        <Modal isOpen={this.state.editModal} toggle={this.toggleEditModal}>
          <Form>
            <ModalHeader toggle={this.toggleEditModal}>Event Details</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label for="title" sm={2}>Title</Label>
                <Col sm={10}>
                  <Input type="text" name="title" placeholder="Title" defaultValue={this.state.event.title}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="location" sm={2}>Location</Label>
                <Col sm={10}>
                  <Input type="text" name="location" placeholder="Location" defaultValue={this.state.event.extendedProps.location}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>Start</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" name="startDate" defaultValue={this.state.event.startDate}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" name="startTime" defaultValue={this.state.event.startTime}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>End</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" name="endDate" defaultValue={this.state.event.endDate}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" name="endTime" defaultValue={this.state.event.endTime}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description" placeholder="None" defaultValue={this.state.event.extendedProps.description}>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button className="mr-auto" color="danger" onClick={this.handleEventDelete}>Delete</Button>
              <Button color="secondary" onClick={this.toggleEditModal}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>

        <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal}>
          <Form>
            <ModalHeader toggle={this.toggleCreateModal}>Create Event</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label for="title" sm={2}>Title</Label>
                <Col sm={10}>
                  <Input type="text" name="title" id="title" placeholder="Title"
                    onChange={e => {
                      this.state.newEvent.title = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="location" sm={2}>Location</Label>
                <Col sm={10}>
                  <Input type="text" name="location" id="location" placeholder="Location"
                    onChange={e => {
                      this.state.newEvent.extendedProps.location = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>Start</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" name="startDate" id="startDate" defaultValue={this.state.newEvent.extendedProps.startDate}
                    onChange={e => {
                      this.state.newEvent.start = new Date(`${e.target.value} ${this.state.newEvent.extendedProps.startTime}`);
                      this.state.newEvent.extendedProps.startDate = e.target.value;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" name="startTime" id="startTime"
                    onChange={e => {
                      this.state.newEvent.start = new Date(`${this.state.newEvent.extendedProps.startDate} ${e.target.value}`);
                      this.state.newEvent.extendedProps.startTime = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>End</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" name="endDate" id="endDate" defaultValue={this.state.newEvent.extendedProps.endDate}
                    onChange={e => {
                      this.state.newEvent.end = new Date(`${e.target.value} ${this.state.newEvent.extendedProps.endTime}`);
                      this.state.newEvent.extendedProps.endDate = e.target.value;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" name="endTime" id="endTime"
                    onChange={e => {
                      this.state.newEvent.end = new Date(`${this.state.newEvent.extendedProps.endDate} ${e.target.value}`);
                      this.state.newEvent.extendedProps.endTime = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description" id="description" placeholder="None"
                  onChange={e => {
                    this.state.newEvent.extendedProps.description = e.target.value;
                  }}>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleCreateModal}>Cancel</Button>
              <Button color="primary" onClick={this.handleEventCreate}>Create</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div >
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
