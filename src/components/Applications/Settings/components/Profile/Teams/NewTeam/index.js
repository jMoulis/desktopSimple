import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../../../../../Modules/Modal/modal';
import UsersLoader from '../../../../../../../Modules/UserLoader';
import Input from '../../../../../../Form/input';
import RessourceItem from '../../../../../../../Modules/RessourceItem';
import Button from '../../../../../../Form/button';
import './index.css';

class NewTeam extends React.Component {
  static propTypes = {
    fetchUsersCountAction: PropTypes.func.isRequired,
    createTeamAction: PropTypes.func.isRequired,
    teamCreation: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    clearTeamMessageAction: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    tabName: PropTypes.string.isRequired,
  };
  state = {
    name: '',
    ressources: '',
    selectedTags: [],
    counters: {},
    selectedUsers: {},
    modal: false,
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    const { usersCount } = nextProps;
    if (usersCount.count) {
      return {
        ...prevState,
        counters: {
          ...prevState.counters,
          [usersCount.count.key]: usersCount.count.count,
        },
      };
    }
    return {
      ...prevState,
    };
  }

  componentWillUnmount() {
    this.props.clearTeamMessageAction();
  }
  handleClose = () => {
    this.setState(() => ({
      modal: false,
    }));
  };
  handleFormKeyPress = evt => {
    if (
      evt.key === 'Enter' &&
      evt.target.type !== 'textarea' &&
      evt.target.type !== 'submit'
    ) {
      evt.preventDefault();
      return false;
    }
    return true;
  };
  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  };
  handleSelectedTags = evt => {
    const { fetchUsersCountAction } = this.props;
    const { value } = evt.target;
    if (evt.key === 'Enter') {
      const filter = {
        filter: this.state.ressources.toLowerCase(),
        type: 'student',
        count: 'true',
        tags: true,
        available: true,
      };
      fetchUsersCountAction(filter);
      this.setState(prevState => ({
        ressources: '',
        selectedTags: [
          ...prevState.selectedTags,
          {
            value: value.toLowerCase(),
            selected: false,
          },
        ],
        counters: {
          ...prevState.counters,
        },
        filter: value,
      }));
    }
  };
  handleSubmit = evt => {
    evt.preventDefault();
    const { createTeamAction, loggedUser, onSuccess, tabName } = this.props;
    const users = Object.entries(this.state.selectedUsers).map(value => {
      let selectedUser = {};
      selectedUser = {
        ...selectedUser,
        spec: value[0],
        user: { _id: value[1]._id },
      };
      return selectedUser;
    });
    const values = {
      users: [...users, { spec: 'manager', user: { _id: loggedUser._id } }],
      name: this.state.name,
      manager: { manager: loggedUser },
    };
    createTeamAction(values);
    onSuccess(tabName);
  };
  handleSearch = filter => {
    this.setState(() => ({
      modal: true,
      filter: {
        filter,
      },
    }));
  };
  handleRemove = ({ target }) => {
    const { tagname } = target.dataset;
    this.setState(prevState => {
      const selectedTagsFiltered = prevState.selectedTags.filter(
        tag => tag.value !== tagname,
      );
      delete prevState.selectedUsers[tagname];
      return {
        ...prevState,
        selectedTags: selectedTagsFiltered,
      };
    });
  };
  handleSelectUser = user => {
    this.setState(prevState => {
      const filteredselectedTags = prevState.selectedTags.map(ressource => {
        if (ressource.value === user.spec) {
          return {
            ...ressource,
            selected: true,
          };
        }
        return ressource;
      });
      return {
        modal: false,
        selectedUsers: {
          ...prevState.selectedUsers,
          [user.spec]: user.user,
        },
        selectedTags: filteredselectedTags,
      };
    });
  };
  render() {
    const { counters, selectedUsers, selectedTags } = this.state;
    const { teamCreation } = this.props;
    const { error, success } = teamCreation;
    return (
      <div id="new-team-settings">
        <div className="new-team-content">
          {success && success.status ? (
            <span>Team created</span>
          ) : (
            <form
              onSubmit={this.handleSubmit}
              noValidate
              onKeyPress={this.handleFormKeyPress}
              className="form"
              name="newTeam"
            >
              <div className="form-content-wrapper">
                <div className="form-content">
                  <Input
                    config={{
                      field: {
                        type: 'text',
                        name: 'name',
                        id: 'name',
                        label: "Team's name",
                      },
                      error: error && error.name && error.name.detail,
                      value: this.state.name,
                      onChange: this.handleInputChange,
                    }}
                  />
                  <div className="ressources" name="ressources">
                    <Input
                      config={{
                        field: {
                          type: 'text',
                          name: 'ressources',
                          id: 'ressources',
                          label: 'Ressources',
                          placeholder: 'Marketing, Php, Finance...',
                        },
                        error:
                          error && error.ressources && error.ressources.detail,
                        small:
                          "ProTips: Type the competence you search an press 'enter'. One at a time",
                        value: this.state.ressources,
                        onChange: this.handleInputChange,
                        keyPress: this.handleSelectedTags,
                      }}
                    />
                    <ul className="ul-nav ressource-container">
                      {selectedTags.length <= 0 && (
                        <li>
                          <div className="ressource-item">
                            <div className="ressource-item-temp" />
                          </div>
                        </li>
                      )}
                      {selectedTags.map(({ value, selected }, index) => (
                        <RessourceItem
                          key={index}
                          config={{
                            value,
                            selected,
                            index,
                            counters,
                            selectedUsers,
                            onClick: this.handleSearch,
                            remove: this.handleRemove,
                          }}
                        />
                      ))}
                    </ul>
                  </div>
                  <Button
                    category="success"
                    style={{ width: '100%' }}
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </form>
          )}
          {this.state.modal && (
            <Modal
              zIndex={6000}
              title="Pick your expert"
              name="close"
              closeFromParent={this.handleClose}
            >
              <UsersLoader
                filter={{ ...this.state.filter, type: 'student' }}
                select={this.handleSelectUser}
              />
            </Modal>
          )}
        </div>
      </div>
    );
  }
}

export default NewTeam;
