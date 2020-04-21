import React, { Component, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
} from "reactstrap";
import "@fortawesome/fontawesome-free/js/all.js";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getEvents,
  deleteEvent,
  addEvent,
  updateEvent,
} from "../../actions/events";

class Calendar extends Component {
  state = {
    event: {
      calendar: 0,
      title: "",
      start: "",
      end: "",
      location: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      edited: false,
    },
    modalVisibility: {
      edit: false,
      create: false,
    },
  };

  static propTypes = {
    events: PropTypes.array.isRequired,
    getEvents: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    addEvent: PropTypes.func.isRequired,
    updateEvent: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  onEventClick = (e) => {
    let event = {
      id: e.event.id,
      title: e.event.title,
      start: e.event.start,
      end: e.event.end,
      location: e.event.extendedProps.location,
      description: e.event.extendedProps.description,
      calendar: e.event.extendedProps.calendar,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      edited: false,
    };
    if (event.start.length === 0) {
      event.startDate = "";
      event.startTime = "";
    } else {
      let date = new Date(event.start);
      date = new Date(date - date.getTimezoneOffset() * 60000).toISOString();
      event.startDate = date.substring(0, 10);
      event.startTime = date.substring(11, 16);
    }
    if (event.end.length === 0) {
      event.endDate = "";
      event.endTime = "";
    } else {
      let date = new Date(event.end);
      date = new Date(date - date.getTimezoneOffset() * 60000).toISOString();
      event.endDate = date.substring(0, 10);
      event.endTime = date.substring(11, 16);
    }
    event.edited = false;
    this.setState({ event });
    this.toggleEditModal();
  };

  onDateClick = (info) => {
    let event = {
      calendar: this.props.user.calendar.id,
      title: "",
      start: "",
      end: "",
      location: "",
      description: "",
      startDate: info.dateStr,
      startTime: "",
      endDate: info.dateStr,
      endTime: "",
      edited: false,
    };
    this.setState({ event });
    this.toggleCreateModal();
  };

  onEventDelete = () => {
    this.props.deleteEvent(this.state.event.id);
    this.toggleEditModal();
  };

  onEventEdit = () => {
    if (this.state.event.edited) {
      this.props.updateEvent(this.state.event);
    }
    this.toggleEditModal();
  };

  onEventCreate = () => {
    this.props.addEvent(this.state.event);
    this.toggleCreateModal();
  };

  toggleEditModal = () => {
    this.setState({
      modalVisibility: {
        edit: !this.state.modalVisibility.edit,
      },
    });
  };

  toggleCreateModal = () => {
    this.setState({
      modalVisibility: {
        create: !this.state.modalVisibility.create,
      },
    });
  };

  componentDidMount() {
    this.props.getEvents(this.props.user);
  }

  render() {
    return (
      <div className="container">
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            bootstrapPlugin,
            interactionPlugin,
          ]}
          themeSystem="bootstrap"
          events={this.props.events}
          eventClick={this.onEventClick}
          dateClick={this.onDateClick}
        />

        <Modal
          isOpen={this.state.modalVisibility.edit}
          toggle={this.toggleEditModal}
        >
          <Form>
            <ModalHeader toggle={this.toggleEditModal}>
              Event Details
            </ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Title</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    placeholder="Title"
                    defaultValue={this.state.event.title}
                    onChange={(e) => {
                      this.state.event.title = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}>Location</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    placeholder="Location"
                    defaultValue={this.state.event.location}
                    onChange={(e) => {
                      this.state.event.location = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>Start</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="date"
                    defaultValue={this.state.event.startDate}
                    onChange={(e) => {
                      this.state.event.start = new Date(
                        `${e.target.value} ${this.state.event.startTime}`
                      );
                      this.state.event.startDate = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    defaultValue={this.state.event.startTime}
                    onChange={(e) => {
                      this.state.event.start = new Date(
                        `${this.state.event.startDate} ${e.target.value}`
                      );
                      this.state.event.startTime = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>End</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="date"
                    name="endDate"
                    defaultValue={this.state.event.endDate}
                    onChange={(e) => {
                      this.state.event.end = new Date(
                        `${e.target.value} ${this.state.event.endTime}`
                      );
                      this.state.event.endDate = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    name="endTime"
                    defaultValue={this.state.event.endTime}
                    onChange={(e) => {
                      this.state.event.end = new Date(
                        `${this.state.event.endDate} ${e.target.value}`
                      );
                      this.state.event.endTime = e.target.value;
                      this.state.event.event.edited = true;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="textarea"
                  placeholder="None"
                  defaultValue={this.state.event.description}
                  onChange={(e) => {
                    this.state.event.description = e.target.value;
                    this.state.event.edited = true;
                  }}
                ></Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                className="mr-auto"
                color="danger"
                onClick={this.onEventDelete}
              >
                Delete
              </Button>
              <Button color="secondary" onClick={this.toggleEditModal}>
                Cancel
              </Button>
              <Button color="primary" onClick={this.onEventEdit}>
                Save
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        <Modal
          isOpen={this.state.modalVisibility.create}
          toggle={this.toggleCreateModal}
        >
          <Form>
            <ModalHeader toggle={this.toggleCreateModal}>
              Create Event
            </ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Title</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => {
                      this.state.event.title = e.target.value;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}>Location</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    placeholder="Location"
                    onChange={(e) => {
                      this.state.event.extendedProps.location = e.target.value;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>Start</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="date"
                    defaultValue={this.state.event.startDate}
                    onChange={(e) => {
                      this.state.event.start = new Date(
                        `${e.target.value} ${this.state.event.startTime}`
                      );
                      this.state.event.startDate = e.target.value;
                    }}
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    onChange={(e) => {
                      this.state.event.start = new Date(
                        `${this.state.event.startDate} ${e.target.value}`
                      );
                      this.state.event.startTime = e.target.value;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={2}>
                  <Label>End</Label>
                </Col>
                <Col sm={6}>
                  <Input
                    type="date"
                    defaultValue={this.state.event.endDate}
                    onChange={(e) => {
                      this.state.event.end = new Date(
                        `${e.target.value} ${this.state.event.endTime}`
                      );
                      this.state.event.endDate = e.target.value;
                    }}
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    onChange={(e) => {
                      this.state.event.end = new Date(
                        `${this.state.event.endDate} ${e.target.value}`
                      );
                      this.state.event.endTime = e.target.value;
                    }}
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="textarea"
                  placeholder="None"
                  onChange={(e) => {
                    this.state.event.extendedProps.description = e.target.value;
                  }}
                ></Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleCreateModal}>
                Cancel
              </Button>
              <Button color="primary" onClick={this.onEventCreate}>
                Create
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  events: state.events.events,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getEvents,
  deleteEvent,
  addEvent,
  updateEvent,
})(Calendar);
