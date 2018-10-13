import { connect } from 'react-redux';

import Settings from '../components/Settings';

const createContainer = connect(
  null,
  null,
);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
