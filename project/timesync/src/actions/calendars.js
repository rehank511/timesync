import { GET_CALENDAR } from "./types";

export const getCalendar = (username) => (dispatch) => {
  fetch(`/api/calendars/${username}/`)
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
