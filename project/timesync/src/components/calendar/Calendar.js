import React, { Component } from "react";
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
import { getCalendar } from "../../actions/calendars";
import { addFriend, removeFriend } from "../../actions/friends";
import { getEvents } from "../../actions/events";

import "../../styles/calendar.scss";

class Calendar extends Component {
  static propTypes = {
    getCalendar: PropTypes.func.isRequired,
    calendar: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
    addFriend: PropTypes.func.isRequired,
    removeFriend: PropTypes.func.isRequired,
    events: PropTypes.array.isRequired,
    getEvents: PropTypes.func.isRequired,
  };

  state = {
    events: [],
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
    isOpen: false,
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
    this.setState({ event });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  isSynced = () => {
    let synced = false;
    if (this.props.user) {
      this.props.user.friends.forEach((friend) => {
        if (friend.calendar.username == this.props.match.params.calendar) {
          synced = true;
        }
      });
    }
    return synced;
  };

  sync = () => {
    this.props.addFriend(this.props.user.id, this.props.calendar.user);
  };

  unsync = () => {
    this.props.user.friends.forEach((friend) => {
      if (friend.calendar.username == this.props.match.params.calendar) {
        this.props.removeFriend(friend);
      }
    });
  };

  componentDidMount() {
    this.props.getCalendar(this.props.match.params.calendar);
  }

  componentDidUpdate() {
    document.title = `@${this.props.match.params.calendar} | TimeSync`;
    if (this.props.user) {
      this.props.getEvents(this.props.user);
    }
  }

  render() {
    const synced = this.isSynced();
    const syncButton = {
      sync: {
        text: "Sync",
        click: this.sync,
      },
    };

    const unsyncButton = {
      unsync: {
        text: "Unsync",
        click: this.unsync,
      },
    };

    let events = [];
    if (synced && this.props.calendar.events) {
      this.props.calendar.events.forEach((event) => {
        event.backgroundColor = "#8e61c7";
        event.borderColor = "#8e61c7";
      });
      events = [...this.props.events, ...this.props.calendar.events];
    } else {
      events = this.props.calendar.events;
    }

    return (
      <div className="container">
        <FullCalendar
          defaultView="dayGridMonth"
          customButtons={
            this.props.isAuthenticated &&
            this.props.user.calendar.username !=
              this.props.match.params.calendar
              ? synced
                ? unsyncButton
                : syncButton
              : {}
          }
          header={{
            left: "prev,next today sync unsync",
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
          events={events}
          eventClick={this.onEventClick}
        />

        <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
          <Form>
            <ModalHeader toggle={this.toggleModal}>Event Details</ModalHeader>
            <ModalBody>
              <FormGroup row>
                <Label sm={2}>Title</Label>
                <Col sn={10}>
                  <Input
                    type="text"
                    placeholder="Title"
                    defaultValue={this.state.event.title}
                    readOnly
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
                    readOnly
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
                    readOnly
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    defaultValue={this.state.event.startTime}
                    readOnly
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
                    readOnly
                  ></Input>
                </Col>
                <Col sm={4}>
                  <Input
                    type="time"
                    name="endTime"
                    defaultValue={this.state.event.endTime}
                    readOnly
                  ></Input>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="textarea"
                  placeholder="None"
                  defaultValue={this.state.event.description}
                  readOnly
                ></Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleModal}>
                Close
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  calendar: state.calendars.calendar,
  events: state.events.events,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getCalendar,
  addFriend,
  removeFriend,
  getEvents,
})(Calendar);
