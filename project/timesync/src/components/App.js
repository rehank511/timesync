import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
        };
    }

    componentDidMount() {
        fetch("api/event")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then(data => {
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    };
                });
            });
    }

    render() {
        return (
            <ul>
                {this.state.data.map(event => {
                    return (
                        <li key={event.event_id}>
                            {event.name}
                            <ul>
                                <li>
                                    <b>Location:</b> {event.location}
                                </li>
                                <li>
                                    <b>Start:</b> {event.start}
                                </li>
                                <li>
                                    <b>End:</b>{event.end}
                                </li>
                                <li>
                                    <b>Description:</b> {event.description}
                                </li>
                            </ul>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);