import { GET_EVENTS, ADD_EVENT, UPDATE_EVENT, DELETE_EVENT } from "./types";

export const getEvents = (user) => (dispatch) => {
  let events = user.calendar.events;
  user.friends.forEach((friend) =>
    friend.calendar.events.forEach((event) => events.push(event))
  );
  dispatch({
    type: GET_EVENTS,
    payload: events,
  });
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
