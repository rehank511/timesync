import { GET_EVENTS, ADD_EVENT, UPDATE_EVENT, DELETE_EVENT } from "./types";

export const getEvents = (id) => (dispatch) => {
  fetch(`/api/calendars/${id}/`)
    .then((response) => {
      return response.json();
    })
    .then((calendar) => {
      dispatch({
        type: GET_EVENTS,
        payload: calendar.events,
      });
    })
    .catch((err) => console.log(err));
};

export const deleteEvent = (id) => (dispatch) => {
  fetch(`/api/events/${id}/`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status == 204) {
      dispatch({
        type: DELETE_EVENT,
        payload: id,
      });
    }
  });
};

export const addEvent = (event) => (dispatch) => {
  fetch("/api/events/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
    .then((response) => {
      return response.json();
    })
    .then((event) => {
      dispatch({
        type: ADD_EVENT,
        payload: event,
      });
    })
    .catch((err) => console.log(err));
};

export const updateEvent = (event) => (dispatch) => {
  event.description = event.extendedProps.description;
  event.location = event.extendedProps.location;
  fetch(`/api/events/${event.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
    .then((response) => {
      return response.json();
    })
    .then((event) => {
      dispatch({
        type: UPDATE_EVENT,
        payload: event,
      });
    })
    .catch((err) => console.log(err));
};
