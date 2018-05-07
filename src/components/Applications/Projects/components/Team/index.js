import React from 'react';
import PropTypes from 'prop-types';
import ProjectInfo from '../../containers/Team/projectInfo';
import './index.css';
import Modal from '../Modal/modal';
import UsersLoader from '../../containers/Team/usersLoader';

class Team extends React.Component {
  static propTypes = {
    fetchUsersCountAction: PropTypes.func.isRequired,
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
    selectedRessources: [],
    modal: false,
    counters: {},
  }
  handleInputChange = (evt) => {
    const { name, value } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  }
  handleSelectRessource = (evt) => {
    const { fetchUsersCountAction } = this.props;
    // const { count, key } = usersCount;
    const { value } = evt.target;
    if (evt.key === 'Enter') {
      fetchUsersCountAction(this.state.ressources.toLowerCase());
      this.setState(prevState => ({
        ressources: '',
        selectedRessources: [
          ...prevState.selectedRessources,
          value.toLowerCase(),
        ],
        counters: {
          ...prevState.counters,
        },
      }));
    }
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
  }
  handleNext = () => {
    console.log('next');
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
  render() {
    return (
      <div className="team">
        <div className="content">
          <ProjectInfo />
        </div>
        <div className="content">
          {/* 1- Create ressource
          2- Choose students from a list
          3- Send message to student */}
          <div>
            <p>Give explanations</p>
            <h1>First: Give a team's name</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="teamname">
                <label htmlFor="teamname">
                  Choose a name:
                </label>
                <input
                  name="teamname"
                  onChange={this.handleInputChange}
                  value={this.state.teamname}
                />
              </div>
              <div name="ressources">
                <label htmlFor="ressources">
                  Choose ressources:
                </label>
                <input
                  name="ressources"
                  onKeyPress={this.handleSelectRessource}
                  onChange={this.handleInputChange}
                  value={this.state.ressources}
                />
                <ul className="ul-nav">
                  {this.state.selectedRessources.map((ressource, index) => (
                    <li key={index}>
                      <div className="ressourceItem">
                        <img src="/img/anonymous.png" alt="Expert" />
                        <span className="ressource-label">{ressource}</span>
                        {<span>{this.state.counters[ressource]}</span>}
                        <button
                          type="button"
                          data-filter={ressource}
                          onClick={this.handleSearch}
                        >Search
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={this.handleNext} type="button">next</button>
            </form>
          </div>
          {this.state.modal &&
            <Modal close={this.handleClose} title="Pick your expert" name="close">
              <UsersLoader filter={this.state.filter} />
            </Modal>
          }
        </div>
      </div>
    );
  }
}

export default Team;
