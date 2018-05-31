import React from 'react';
import './index.css';

class ListRooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className="rooms">
        <h1>Rooms List</h1>
        <ul>
          {this.props.loggedUser.rooms.map(room => <li key={room}>{room}</li>)}
        </ul>
      </div>
    );
  }
}

export default ListRooms;
