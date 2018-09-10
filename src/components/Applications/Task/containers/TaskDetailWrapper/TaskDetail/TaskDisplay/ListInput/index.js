import { connect } from 'react-redux';

import { editTaskAction } from '../../../../../../../../store/reducers/taskReducer';
import ListInput from '../../../../../components/TaskDetailWrapper/TaskDetail/TaskDisplay/ListInput';

const mapStateToProps = ({ taskReducer }) => ({
  activeTaskProcess: taskReducer.activeTaskProcess,
});

const mapDispatchProps = dispatch => ({
  editTaskAction: values => {
    dispatch(editTaskAction(values));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchProps,
);
const ListInputContainer = createContainer(ListInput);
export default ListInputContainer;
