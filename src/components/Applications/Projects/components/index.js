import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/ListProject';
import NewProject from '../containers/NewProject/newProject';
import AppToolBar from '../../../../Modules/AppToolbar';

class Projects extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
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

  handleTabSelect = evt => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      tab: name,
      subMenu: {},
    }));
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

  render() {
    const { globalActions, globalProps } = this.props;

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
              show: globalProps.loggedUser.typeUser === 'company',
            },
          ]}
        />
        {this.state.tab === 'projects' && (
          <ListProject
            selectTab={this.handleTabSelect}
            globalActions={globalActions}
            globalProps={globalProps}
          />
        )}
        {this.state.tab === 'create-project' && (
          <NewProject
            onSuccess={this.handleSuccessCreation}
            tabName="projects"
          />
        )}
      </div>
    );
  }
}

export default Projects;
