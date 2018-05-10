import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import Modal from '../Modal/modal';
import UsersLoader from '../../containers/Team/usersLoader';

class Team extends React.Component {
  static propTypes = {
    fetchUsersCountAction: PropTypes.func.isRequired,
    createTeamAction: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    teamCreation: PropTypes.object.isRequired,
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
  state = {
    teamname: '',
    ressources: '',
    selectedTags: [],
    modal: false,
    counters: {},
    selectedUsers: {},
  }
  handleFormKeyPress = (evt) => {
    if (evt.key === 'Enter' && evt.target.type !== 'textarea' && evt.target.type !== 'submit') {
      evt.preventDefault();
      return false;
    }
    return true;
  }
  handleInputChange = (evt) => {
    const { name, value } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  }
  handleSelectedTags = (evt) => {
    const { fetchUsersCountAction } = this.props;
    // const { count, key } = usersCount;
    const { value } = evt.target;
    if (evt.key === 'Enter') {
      fetchUsersCountAction(this.state.ressources.toLowerCase());
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
      }));
    }
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { createTeamAction, project } = this.props;
    const values = {
      users: Object.values(this.state.selectedUsers),
      name: this.state.teamname,
      projects: [{ _id: project._id, title: project.title }],
    };
    createTeamAction(values);
  }
  handleSearch = (evt) => {
    const { filter } = evt.target.dataset;
    this.setState(() => ({
      modal: true,
      filter,
    }));
  }
  handleClose = () => {
    this.setState(() => ({
      modal: false,
    }));
  }
  handleRemove = ({ target }) => {
    const { tagname } = target.dataset;
    this.setState((prevState) => {
      const selectedTagsFiltered = prevState.selectedTags.filter(tag => tag.value !== tagname);
      delete prevState.selectedUsers[tagname];
      return ({
        ...prevState,
        selectedTags: selectedTagsFiltered,
      });
    });
  }
  handleSelectUser = ({ target }) => {
    const { user } = target.dataset;
    const userParsed = JSON.parse(user);
    this.setState((prevState) => {
      const filteredselectedTags = prevState.selectedTags.map((ressource) => {
        if (ressource.value === userParsed.key) {
          return {
            ...ressource,
            selected: true,
          };
        }
        return ressource;
      });
      return ({
        modal: false,
        selectedUsers: {
          ...prevState.selectedUsers,
          [userParsed.key]: userParsed.value,
        },
        selectedTags: filteredselectedTags,
      });
    });
  }
  render() {
    const {
      counters,
      selectedUsers,
      ressources,
      teamname,
      selectedTags,
    } = this.state;
    const { teamCreation } = this.props;
    const { error } = teamCreation;
    return (
      <div className="team">
        <div className="content">
          <ProjectInfo />
        </div>
        <div className="content">
          <div>
            <p>Give explanations</p>
            <h1>First: Give a team's name</h1>
            <form
              onSubmit={this.handleSubmit}
              noValidate="true"
              onKeyPress={this.handleFormKeyPress}
            >
              <div className="teamname">
                <label htmlFor="teamname">
                  Choose a name:
                </label>
                <input
                  name="teamname"
                  onChange={this.handleInputChange}
                  value={teamname}
                />
                {error && error.name && <span>{error.name.detail}</span>}
              </div>
              <div name="ressources">
                <label htmlFor="ressources">
                  Choose ressources:
                </label>
                <input
                  name="ressources"
                  onKeyPress={this.handleSelectedTags}
                  onChange={this.handleInputChange}
                  value={ressources}
                />
                <ul className="ul-nav">
                  {selectedTags.map(({ value, selected }, index) => (
                    <li key={index}>
                      <div className="ressourceItem">
                        <button
                          data-tagname={value}
                          onClick={this.handleRemove}
                          type="button"
                        >
                          Remove
                        </button>
                        <img
                          src={selectedUsers[value] ?
                          selectedUsers[value].picture :
                          '/img/anonymous.png'}
                          alt="Expert"
                        />
                        <span className="ressource-label">{value}</span>
                        {<span>{selected ? selectedUsers[value].fullName : counters[value]}</span>}
                        <button
                          type="button"
                          data-filter={value}
                          onClick={this.handleSearch}
                        >
                          {selected ? 'Change' : 'Search'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={this.handleNext} type="button">next</button>
              <button type="submit">Create</button>
            </form>
          </div>
          {this.state.modal &&
            <Modal close={this.handleClose} title="Pick your expert" name="close">
              <UsersLoader filter={this.state.filter} select={this.handleSelectUser} />
            </Modal>
          }
        </div>
      </div>
    );
  }
}

export default Team;
