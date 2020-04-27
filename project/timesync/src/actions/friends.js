import { ADD_FRIEND, DELETE_FRIEND } from "./types";

export const addFriend = (creator, friend) => (dispatch) => {
  let friendship = {
    creator,
    friend,
  };
  fetch("/api/friendships/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendship),
  })
    .then((response) => {
      return response.json();
    })
    .then((friendship) => {
      dispatch({
        type: ADD_FRIEND,
        payload: friendship,
      });
    })
    .catch((err) => console.log(err));
};

export const removeFriend = (friend) => (dispatch) => {
  fetch(`/api/friendships/${friend.id}/`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.status == 204) {
        dispatch({
          type: DELETE_FRIEND,
          payload: friend,
        });
      }
    })
    .catch((err) => console.log(err));
};
