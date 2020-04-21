import { GET_CALENDAR } from "./types";

export const getCalendar = (id) => (dispatch) => {
  fetch(`/api/calendars/${id}/`)
    .then((response) => {
      return response.json();
    })
    .then((calendar) => {
      dispatch({
        type: GET_CALENDAR,
        payload: calendar,
      });
    })
    .catch((err) => console.log(err));
};
