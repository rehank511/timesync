import { GET_CALENDAR } from "../actions/types";

const initialState = {
  calendar: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CALENDAR:
      return {
        ...state,
        calendar: action.payload,
      };
    default:
      return state;
  }
};
