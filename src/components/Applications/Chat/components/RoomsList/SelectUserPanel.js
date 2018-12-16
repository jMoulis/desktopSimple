import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import './selectUserPanel.css';

class SelectUserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.listref = React.createRef();
  }

  componentDidMount() {
    const { hideListAction } = this.props;
    document.addEventListener('click', evt => {
      const container = this.listref.current;
      if (container && !container.contains(evt.target)) {
        hideListAction();
      }
    });
  }

  componentWillUnmount() {
    const { hideListAction } = this.props;
    document.removeEventListener('click', evt => {
      const container = this.listref.current;
      if (container && !container.contains(evt.target)) {
        hideListAction();
      }
    });
  }
  render() {
    const { users, callback } = this.props;
    return (
      <ul className="select-user-list" ref={this.listref}>
        {users.map(user => (
          <UserIconContainer
            key={user._id}
            user={{ user }}
            name
            callback={callback}
          />
        ))}
        {users.length === 0 && <li>No users</li>}
      </ul>
    );
  }
}

SelectUserPanel.propTypes = {
  users: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
};

export default SelectUserPanel;
