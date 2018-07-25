import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import AlertBox from '../../../../Modules/AlertBox';
import './index.css';
import UserIcon from '../../../../Modules/UserIcon';
import AddFilesInput from '../../../../Modules/filesHandler/addFilesInput';
import TagList from '../../../../Modules/Tag/tagList';

class TeamProject extends React.Component {
  static propTypes = {
    activeTeam: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    closeFromParent: PropTypes.func.isRequired,
    editTeamAction: PropTypes.func.isRequired,
    fetchSingleProjectAction: PropTypes.func.isRequired,
    projects: PropTypes.array,
  }
  static defaultProps = {
    projects: [],
  }
  state = {
    alertBox: false,
  }
  handleDelete = () => {
    const {
      editTeamAction,
      projects,
      activeTeam,
      fetchSingleProjectAction,
    } = this.props;
    const projectEdited = projects.find((project) => {
      if (project.teams) {
        return project.teams.find(projectTeam => projectTeam._id === activeTeam._id);
      }
      return null;
    });
    if (projectEdited) {
      fetchSingleProjectAction(projectEdited._id);
    }
    editTeamAction({
      project: {
        value: null,
        changed: true,
      },
    });
    this.setState(prevState => ({
      ...prevState,
      alertBox: !prevState.alertBox,
    }));
  }
  handleShowAlertBox = () => {
    this.setState(prevState => ({
      ...prevState,
      alertBox: !prevState.alertBox,
    }));
  }
  render() {
    const { activeTeam, globalActions, closeFromParent } = this.props;
    const { project } = activeTeam;
    if (!project) {
      return (
        <div className="team-project no-project">
          <h1>No project  selected yet</h1>
          <p>To start you should select a project</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              globalActions.startAppAction('Projects');
              closeFromParent();
            }}
          >Search Project
          </button>
        </div>
      );
    }
    return (
      <div className="team-project">
        <h1>Project Detail</h1>
        <ul className="ul-unstyled team-project-info-list">
          <li>
            <div className="team-project-company">
              <img className="team-project-company-logo" src={`${project.author.company.picture || '/img/company-generic.png'}`} alt="logo company" />
              <div className="team-project-company-info">
                <p className="team-project-company-info-name">{project.author.company.companyName}</p>
                <div className="team-project-company-author">
                  <UserIcon
                    user={{ user: project.author }}
                    classCss="middle"
                  />
                  <p>{project.author.fullName}</p>
                </div>
              </div>
            </div>
          </li>
          <li className="team-project-info-list-item">
            <label>Title:</label> {project.title}
          </li>
          <li className="team-project-info-list-item">
            <label>Description:</label><p>{project.description}</p>
          </li>
          <li className="team-project-info-list-item">
            <label>Due Date:</label> {project.dueDate && <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>}
          </li>
          <li className="team-project-info-list-item">
            <label>Price:</label> {project.price ? project.price : 'None'}
          </li>
          <li className="team-project-info-list-item">
            <label>Contest:</label> {project.isContest ? `${project.maxTeam} teams` : 'No contest'}
          </li>
          <li className="team-project-info-list-item">
            <label>Tags:</label>
            <TagList tags={project.tags} />
          </li>
          <li>
            {project.docs.length === 0 ?
              <p>No Documents</p> :
              <AddFilesInput docs={project.docs} readOnly />
            }
          </li>
        </ul>
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.handleShowAlertBox}
        >
          Cancel participation
        </button>
        {this.state.alertBox &&
          <AlertBox
            title="Deleting Your participation"
            message="WatchOut you are on your way to leave this project"
            buttons={[
              {
                type: 'danger',
                action: this.handleDelete,
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
        }
      </div>
    );
  }
}

export default TeamProject;
