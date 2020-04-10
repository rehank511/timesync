import { GET_EVENTS, ADD_EVENT, UPDATE_EVENT, DELETE_EVENT } from "../actions/types";

const initialState = {
    events: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS:
            return {
                ...state,
                events: action.payload
            };
        case ADD_EVENT:
            return {
                ...state,
                events: [...state.events, action.payload]
            };
        case UPDATE_EVENT:
            return {
                ...state,
                events: state.events.map(event => event.id == action.payload.id ? event = action.payload : event)
            };
        case DELETE_EVENT:
            return {
                ...state,
                events: state.events.filter(event => event.id != action.payload)
            };
        default:
            return state;
    }
}