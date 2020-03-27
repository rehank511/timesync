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
        extendedProps: {
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          location: "",
          description: "",
          edited: false,
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

  handleEventClick = ({ event }) => {
    var event = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: {
        location: event.extendedProps.location,
        description: event.extendedProps.description
      }
    };
    if (event.start.length === 0) {
      event.extendedProps.startDate = "";
      event.extendedProps.startTime = "";
    } else {
      let date = new Date(event.start)
      date = new Date(date - (date.getTimezoneOffset() * 60000)).toISOString();
      event.extendedProps.startDate = date.substring(0, 10);
      event.extendedProps.startTime = date.substring(11, 16);
    }
    if (event.end.length === 0) {
      event.extendedProps.endDate = "";
      event.extendedProps.endTime = "";
    } else {
      let date = new Date(event.end);
      date = new Date(date - (date.getTimezoneOffset() * 60000)).toISOString();
      event.extendedProps.endDate = date.substring(0, 10);
      event.extendedProps.endTime = date.substring(11, 16);
    }
    event.extendedProps.edited = false;
    this.setState({ event });
    this.toggleEditModal();
  };

  handleEventDelete = () => {
    fetch(`api/events/${this.state.event.id}/`,
      {
        method: "DELETE"
      }).then(response => {
        if (response.status < 300) {
          this.setState({
            events: this.state.events.filter(event => event.id != this.state.event.id)
          });
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

  handleEventEdit = () => {
    if (this.state.event.extendedProps.edited) {
      let event = {
        event_id: this.state.event.id,
        calendar_id: 1,
        title: this.state.event.title,
        location: this.state.event.extendedProps.location,
        start: this.state.event.start,
        end: this.state.event.end,
        description: this.state.event.extendedProps.description
      }
      console.log(event);
      fetch(`api/events/${this.state.event.id}/`, {
        method: "PUT",
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
        console.log(event);
        this.setState({
          events: this.state.events.map(e => e.id == event.id ? e = event : e)
        });
        this.toggleEditModal();
      });
    } else {
      this.toggleEditModal();
    }
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
                <Label sm={2}>Title</Label>
                <Col sm={10}>
                  <Input type="text" placeholder="Title" defaultValue={this.state.event.title}
                    onChange={e => {
                      this.state.event.title = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}>Location</Label>
                <Col sm={10}>
                  <Input type="text" placeholder="Location" defaultValue={this.state.event.extendedProps.location}
                    onChange={e => {
                      this.state.event.extendedProps.location = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>Start</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" defaultValue={this.state.event.extendedProps.startDate}
                    onChange={e => {
                      this.state.event.start = new Date(`${e.target.value} ${this.state.event.extendedProps.startTime}`);
                      this.state.event.extendedProps.startDate = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" defaultValue={this.state.event.extendedProps.startTime}
                    onChange={e => {
                      this.state.event.start = new Date(`${this.state.event.extendedProps.startDate} ${e.target.value}`);
                      this.state.event.extendedProps.startTime = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>End</Label>
                </Col>
                <Col sm={6}>
                  <Input type="date" name="endDate" defaultValue={this.state.event.extendedProps.endDate}
                    onChange={e => {
                      this.state.event.end = new Date(`${e.target.value} ${this.state.event.extendedProps.endTime}`);
                      this.state.event.extendedProps.endDate = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time" name="endTime" defaultValue={this.state.event.extendedProps.endTime}
                    onChange={e => {
                      this.state.event.end = new Date(`${this.state.event.extendedProps.endDate} ${e.target.value}`);
                      this.state.event.extendedProps.endTime = e.target.value;
                      this.state.event.extendedProps.edited = true;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" placeholder="None" defaultValue={this.state.event.extendedProps.description}
                  onChange={e => {
                    this.state.event.extendedProps.description = e.target.value;
                    this.state.event.extendedProps.edited = true;
                  }}>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button className="mr-auto" color="danger" onClick={this.handleEventDelete}>Delete</Button>
              <Button color="secondary" onClick={this.toggleEditModal}>Cancel</Button>
              <Button color="primary" onClick={this.handleEventEdit}>Save</Button>
            </ModalFooter>
          </Form>
        </Modal>

        <Modal isOpen={this.state.createModal} toggle={this.toggleCreateModal}>
          <Form>
            <ModalHeader toggle={this.toggleCreateModal}>Create Event</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Title</Label>
                <Col sm={10}>
                  <Input type="text" placeholder="Title"
                    onChange={e => {
                      this.state.newEvent.title = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}>Location</Label>
                <Col sm={10}>
                  <Input type="text" placeholder="Location"
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
                  <Input type="date" defaultValue={this.state.newEvent.extendedProps.startDate}
                    onChange={e => {
                      this.state.newEvent.start = new Date(`${e.target.value} ${this.state.newEvent.extendedProps.startTime}`);
                      this.state.newEvent.extendedProps.startDate = e.target.value;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time"
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
                  <Input type="date" defaultValue={this.state.newEvent.extendedProps.endDate}
                    onChange={e => {
                      this.state.newEvent.end = new Date(`${e.target.value} ${this.state.newEvent.extendedProps.endTime}`);
                      this.state.newEvent.extendedProps.endDate = e.target.value;
                    }}>
                  </Input>
                </Col>
                <Col sm={4}>
                  <Input type="time"
                    onChange={e => {
                      this.state.newEvent.end = new Date(`${this.state.newEvent.extendedProps.endDate} ${e.target.value}`);
                      this.state.newEvent.extendedProps.endTime = e.target.value;
                    }}>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" placeholder="None"
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
