import React from 'react';
import PropTypes from 'prop-types';

import './editTeam.css';
import Modal from '../../../../Modules/Modal/modal';
import UsersLoader from '../../../../Modules/UserLoader';
import Input from '../../../Form/input';
import RessourceItem from '../../../../Modules/RessourceItem';
import Model from './team-model';
import Button from '../../../Form/button';
import AlertBox from '../../../../Modules/AlertBox';

class EditTeam extends React.Component {
  static propTypes = {
    fetchUsersCountAction: PropTypes.func.isRequired,
    editTeamAction: PropTypes.func.isRequired,
    closeFromParent: PropTypes.func,
    activeTeamProcess: PropTypes.object.isRequired,
    clearTeamMessageAction: PropTypes.func.isRequired,
    deleteTeamAction: PropTypes.func.isRequired,
  };
  static defaultProps = {
    closeFromParent: null,
  };

  constructor(props) {
    super(props);
    const { activeTeamProcess } = this.props;
    const { team } = activeTeamProcess;
    let field = {};
    Object.keys(Model).map(key => {
      field = {
        ...field,
        [key]: team
          ? { value: team[key], focus: false, changed: false }
          : { value: '', focus: false, changed: false },
      };
      return field;
    });
    let selectedUsers = {};
    let selectedTags = [];
    let manager = {};
    team.users.map(user => {
      if (user.spec !== 'manager') {
        selectedUsers = {
          ...selectedUsers,
          [user.spec]: user.user,
        };
        selectedTags = [
          ...selectedTags,
          {
            value: user.spec.toLowerCase(),
            selected: true,
          },
        ];
      } else {
        manager = {
          spec: user.spec,
          user: user.user,
        };
      }
      return true;
    });
    this.state = {
      ...field,
      ressources: '',
      selectedTags,
      counters: {},
      selectedUsers,
      modal: false,
      manager,
      specAlreadySelected: null,
      alertBox: false,
    };
  }
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
  componentDidUpdate() {
    const { activeTeamProcess, closeFromParent } = this.props;
    const { success } = activeTeamProcess;
    if (success && success.status) {
      setTimeout(() => {
        closeFromParent('createTeamModal');
      }, 300);
    }
    return true;
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
      [name]: {
        value,
        changed: true,
      },
    }));
  };
  checkSelectedTags = (array, value) => {
    let isExist;
    array.forEach(object => {
      if (object.value === value) {
        isExist = true;
      } else {
        isExist = false;
      }
    });
    return isExist;
  };

  handleSelectedTags = evt => {
    const { fetchUsersCountAction } = this.props;
    const { value } = evt.target;
    if (evt.key === 'Enter') {
      const isAlreadySelected = this.state.selectedTags.find(
        tag => tag.value === value,
      );
      if (!isAlreadySelected) {
        const filter = {
          filter: this.state.ressources.value.toLowerCase(),
          type: 'student',
          count: 'true',
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
          specAlreadySelected: null,
        }));
      } else {
        this.setState(prevState => ({
          ...prevState,
          ressources: '',
          specAlreadySelected: value,
        }));
      }
    }
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
    const { editTeamAction } = this.props;
    this.setState(
      prevState => {
        const selectedTagsFiltered = prevState.selectedTags.filter(
          tag => tag.value !== tagname,
        );
        delete prevState.selectedUsers[tagname];
        return {
          ...prevState,
          selectedTags: selectedTagsFiltered,
        };
      },
      () => {
        const users = [];
        Object.entries(this.state.selectedUsers).forEach(selectedUser => {
          users.push({
            spec: selectedUser[0],
            user: selectedUser[1],
          });
        });
        if (this.state.manager) {
          users.push(this.state.manager);
        }
        const values = {
          users,
        };
        editTeamAction(values);
      },
    );
  };
  handleSelectUser = user => {
    const { editTeamAction } = this.props;
    this.setState(
      prevState => {
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
      },
      () => {
        const users = [];
        Object.entries(this.state.selectedUsers).forEach(selectedUser => {
          users.push({
            spec: selectedUser[0],
            user: selectedUser[1],
          });
        });
        if (this.state.manager) {
          users.push(this.state.manager);
        }
        const values = {
          users,
        };
        editTeamAction(values);
      },
    );
  };
  hanldeDeleteTeam = () => {
    const { deleteTeamAction, activeTeamProcess, closeFromParent } = this.props;
    deleteTeamAction(activeTeamProcess.team._id);
    closeFromParent();
  };
  handleShowAlertBox = () => {
    this.setState(prevState => ({
      ...prevState,
      alertBox: !prevState.alertBox,
    }));
  };
  handleOnBlur = evt => {
    evt.preventDefault();
    const { editTeamAction } = this.props;
    const values = {
      name: this.state.name,
    };
    editTeamAction(values);
  };
  render() {
    const {
      counters,
      selectedUsers,
      selectedTags,
      specAlreadySelected,
    } = this.state;
    const { activeTeamProcess } = this.props;
    const { error } = activeTeamProcess;
    return (
      <div id="new-team">
        <form
          onSubmit={this.handleSubmit}
          noValidate="true"
          onKeyPress={this.handleFormKeyPress}
          className="form"
          name="detailProjectModal"
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
                  value: this.state.name.value,
                  onChange: this.handleInputChange,
                  blur: this.handleOnBlur,
                }}
              />
              <div name="ressources">
                <Input
                  config={{
                    field: {
                      type: 'text',
                      name: 'ressources',
                      id: 'ressources',
                      label: 'Ressources',
                      placeholder: 'Marketing, Php, Finance...',
                    },
                    error: error && error.ressources && error.ressources.detail,
                    small:
                      "ProTips: Type the competence you search an press 'enter'. One at a time",
                    value: this.state.ressources.value,
                    onChange: this.handleInputChange,
                    keyPress: this.handleSelectedTags,
                  }}
                />
                <ul className="ul-nav ressource">
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
                        specAlreadySelected:
                          specAlreadySelected && specAlreadySelected,
                        onClick: this.handleSearch,
                        remove: this.handleRemove,
                      }}
                    />
                  ))}
                </ul>
              </div>
              <div className="btn-container">
                <Button
                  onClick={this.handleShowAlertBox}
                  category="danger"
                  style={{ width: '100%', marginTop: '.5rem' }}
                  type="button"
                >
                  Delete the team
                </Button>
              </div>
            </div>
          </div>
        </form>
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
        {this.state.alertBox && (
          <AlertBox
            title="Deleting Team"
            message="Watch out you are on your way to delete a team"
            buttons={[
              {
                type: 'danger',
                action: this.hanldeDeleteTeam,
                label: 'Yeap',
                category: 'danger',
              },
              {
                type: 'success',
                action: this.handleShowAlertBox,
                label: 'Nope',
                category: 'success',
              },
            ]}
            type="danger"
          />
        )}
      </div>
    );
  }
}

export default EditTeam;
