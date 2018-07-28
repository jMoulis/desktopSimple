import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/ListProject';
import NewProject from '../containers/NewProject/newProject';
import Input from '../../../Form/input';

class Projects extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
  };
  state = {
    tab: 'projects',
    search: '',
  };
  componentDidMount() {
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction();
  }
  handleSuccessCreation = tabName => {
    this.setState(prevState => ({
      ...prevState,
      tab: tabName,
    }));
  };
  handleSubmit = evt => {
    evt.preventDefault();
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction({ search: this.state.search });
  };
  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  handleTabSelect = evt => {
    const { dataset } = evt.currentTarget;
    let dataSetToState = {};
    Object.keys(dataset).map(key => {
      dataSetToState = { ...dataSetToState, [key]: dataset[key] };
      return dataSetToState;
    });
    this.setState(() => ({
      ...dataSetToState,
    }));
  };
  handleSorting = () => {
    const { fetchProjectsAction } = this.props;
    let sorting = -1;
    if (this.state.sorting === 1) {
      sorting = -1;
    } else {
      sorting = 1;
    }
    this.setState(
      prevState => ({
        ...prevState,
        sorting,
      }),
      () =>
        fetchProjectsAction({
          search: this.state.search,
          sorting: this.state.sorting,
        }),
    );
  };
  render() {
    const { globalActions, globalProps, loggedUser } = this.props;
    return (
      <div className="project-container">
        <div
          className="app-toolbar d-flex flex-justify-between"
          key="app-toolbar"
        >
          <ul className="app-toolbar-list">
            <li className="app-toolbar-list-item">
              <button
                className="btn-app-toolbar unselectable"
                name="projects"
                data-tab="projects"
                onClick={this.handleTabSelect}
              >
                Projects
              </button>
            </li>
            {loggedUser.typeUser === 'company' && (
              <li className="app-toolbar-list-item">
                <button
                  className="btn-app-toolbar unselectable"
                  name="create-project"
                  data-tab="create-project"
                  onClick={this.handleTabSelect}
                >
                  New Project
                </button>
              </li>
            )}
          </ul>
          <div className="d-flex">
            <form
              onSubmit={this.handleSubmit}
              className="project-container-form"
            >
              <Input
                config={{
                  field: {
                    type: 'text',
                    name: 'search',
                    placeholder: 'Search',
                  },
                  onChange: this.handleInputChange,
                  value: this.state.search,
                  className: 'project-input-search',
                  parentClassName: 'project-input-search-container',
                }}
              />
              <i className="fas fa-search project-input-search-icon" />
            </form>
            <button onClick={this.handleSorting} type="button">
              Asc/desc
            </button>
          </div>
        </div>
        {this.state.tab === 'projects' && (
          <ListProject
            selectTab={this.handleTabSelect}
            loggedUser={loggedUser}
            globalActions={globalActions}
            globalProps={globalProps}
          />
        )}
        {this.state.tab === 'create-project' && (
          <NewProject
            loggedUser={loggedUser}
            onSuccess={this.handleSuccessCreation}
            tabName="projects"
          />
        )}
      </div>
    );
  }
}

export default Projects;
