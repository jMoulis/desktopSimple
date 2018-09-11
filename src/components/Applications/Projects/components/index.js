import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/ListProject';
import NewProject from '../containers/NewProject/newProject';
import AppToolBar from '../../../../Modules/AppToolbar';

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
    asc: true,
    sorting: 1,
    filterParams: {
      filter: '',
    },
  };
  componentDidMount() {
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction(this.state.filterParams);
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
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      tab: name,
      subMenu: {},
    }));
  };
  addValueToStateFilters = (filters, filterName) => {
    if (filters.some(filter => filter.label === filterName.label)) {
      return filters;
    }
    if (filterName.type === 'main') {
      return [...filters.filter(filter => filter.type !== filterName.type)];
    }
    return [...filters, filterName];
  };
  handleAppToolBarSearch = filter => {
    const { fetchProjectsAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filterParams: {
          ...prevState.filterParams,
          ...filter,
        },
      }),
      () => {
        fetchProjectsAction(this.state.filterParams);
      },
    );
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
        asc: !prevState.asc,
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
        <AppToolBar
          search={{
            searchField: true,
            action: this.handleAppToolBarSearch,
            searchFieldLabel: 'Spec, Student name, Company name, Description',
            show: true,
          }}
          menus={[
            {
              label: 'Projects',
              action: this.handleTabSelect,
              name: 'projects',
              show: true,
            },
            {
              label: 'New Project',
              action: this.handleTabSelect,
              name: 'create-project',
              show: loggedUser.typeUser === 'company',
            },
          ]}
        />
        {/* <div
          className="app-toolbar d-flex flex-justify-between flex-align-items-center"
          key="app-toolbar"
        >
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
            <button
              className="btn-asc pointer d-flex"
              onClick={this.handleSorting}
              type="button"
              title="Sorting by date"
            >
              <i className="absolute fas fa-sort-up fa-2x" />
              <i className="fas fa-sort-down fa-2x" />
            </button>
          </div> 
        </div> */}
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
