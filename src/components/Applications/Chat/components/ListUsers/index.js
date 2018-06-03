import React from 'react';
import './index.css';

class ListUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className="users">
        <div>users</div>
      </div>
    );
  }
}

export default ListUsers;
