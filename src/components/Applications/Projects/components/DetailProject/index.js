import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.css';
import Model from '../Model/project-model';
import Input from '../../../../Form/input';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import Checkbox from '../../../../Form/checkbox';
import InfoPanel from '../../containers/DetailProject/InfoPanel';
import AddFilesInput from '../../../../../Modules/filesHandler/addFilesInput';
import AlertBox from '../../../../../Modules/AlertBox';
import UserIcon from '../../../../../Modules/UserIcon';
import Loader from '../../../../../Modules/Loader';
import EditFormProjectContainer from '../../containers/DetailProject/editFormProject';

class DetailProject extends React.Component {
  static propTypes = {
    activeProjectProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
    editProjectAction: PropTypes.func.isRequired,
    openNewTeamModal: PropTypes.func.isRequired,
    deleteProjectAction: PropTypes.func.isRequired,
    closeFromParent: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    const { activeProjectProcess } = props;
    const { project } = activeProjectProcess;
    this.state = {
      delete: false,
      showAlertBox: false,
    };
  }

  handleDeleteProject = () => {
    const { deleteProjectAction, activeProjectProcess, closeFromParent } = this.props;
    deleteProjectAction(activeProjectProcess.project._id);
    closeFromParent('detailProjectModal');
  }
  handleSubscribe = (evt) => {
    const { name } = evt.currentTarget;
    const { editProjectAction, loggedUser } = this.props;
    const stateSubscribers = this.state.form.subscribers.value;

    let subscribers = [];
    const userAlreadySubscribed = stateSubscribers.find(subscriber => (
      subscriber._id === loggedUser._id
    ));

    switch (name) {
      case 'subscribe':
        if (userAlreadySubscribed) {
          // do not add the user if already subscribed
          // in case of corrupted db
          subscribers = stateSubscribers;
          return subscribers;
        }
        return this.setState(prevState => ({
          ...prevState,
          form: {
            ...prevState.form,
            subscribers: {
              value: [
                ...stateSubscribers,
                { _id: loggedUser._id },
              ],
              changed: true,
            },
          },
        }), () => editProjectAction(this.state.form));
      case 'unsubscribe':
        subscribers = stateSubscribers.filter(subscriber => (
          subscriber._id !== loggedUser._id));
        return this.setState(prevState => ({
          ...prevState,
          form: {
            ...prevState.form,
            subscribers: {
              value: subscribers,
              changed: true,
            },
          },
        }), () => editProjectAction(this.state.form));
      default:
        break;
    }
  }
  handleShowAlertBox = () => {
    this.setState(prevState => ({
      ...prevState,
      showAlertBox: !prevState.showAlertBox,
    }));
  }
  handleShare = () => {
    console.log('shared');
    // Open a message to send to...
  }
  render() {
    const {
      activeProjectProcess,
      openNewTeamModal,
      loggedUser,
      globalActions,
      globalProps,
      editProjectAction,
    } = this.props;
    const { loading, project } = activeProjectProcess;
    const user = loggedUser;
    if (loading || Object.keys(project).length === 0) {
      if (this.state.delete) {
        return <span>Message confirmation deleted</span>;
      }
      return <Loader />;
    }
    return (
      <div id="edit-project" key="app-content" >
        <div className="">
          <EditFormProjectContainer loggedUser={loggedUser} />
          {project.author._id === user._id &&
            <button
              name="detailProjectModal"
              type="button"
              className="btn btn-danger"
              onClick={this.handleShowAlertBox}
            >Delete
            </button>
          }
          <InfoPanel
            openCreateTeamModal={openNewTeamModal}
            user={user}
            globalActions={{
                ...globalActions,
                editProjectAction,
            }}
            globalProps={globalProps}
          />
        </div>
        <div className="actions">
          {project.author._id !== user._id &&
            project.subscribers &&
              <button
                title={project.subscribers.find(subscriber => subscriber._id === user._id) ?
                  'Unsubscribe from the project' :
                  'subscribe to the project'
                }
                name={project.subscribers.find(subscriber => subscriber._id === user._id) ?
                  'unsubscribe' :
                  'subscribe'
                }
                className={`actions-button actions-button-subscribe
                  ${project.subscribers.find(subscriber => subscriber._id === user._id) &&
                    ' subscribed'}`
                  }
                type="button"
                onClick={this.handleSubscribe}
              >
                {project.subscribers.find(subscriber => subscriber._id === user._id) ?
                  <i className="fas fa-thumbs-up" /> :
                  <i className="fas fa-thumbs-up" />}
              </button>}
          <button
            className="actions-button actions-button-share"
            type="button"
            title="Share the project"
            onClick={this.handleShare}
          >
            <i className="fas fa-share-alt" />
          </button>
        </div>
        {this.state.showAlertBox &&
          <AlertBox
            title="Confirmation: Delete Project"
            message="Watch out, Are you really willing to delete this project?"
            buttons={
              [
                {
                  type: 'danger',
                  action: this.handleDeleteProject,
                  label: 'Yeap',
                  category: 'danger',
                },
                {
                  type: 'success',
                  action: this.handleShowAlertBox,
                  label: 'Nope',
                  category: 'success',
                },
              ]
            }
            type="danger"
          />}
      </div>
    );
  }
}

export default DetailProject;
