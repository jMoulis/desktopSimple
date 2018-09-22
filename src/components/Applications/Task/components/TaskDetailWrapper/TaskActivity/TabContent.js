import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import UserIcon from '../../../../../../Modules/UserIcon';
import './tab.css';

const TabContent = ({ data, type, children }) => (
  <li className="tab-content">
    <header className="d-flex">
      <UserIcon
        classCss="middle"
        user={{
          user: {
            _id: data.author._id,
            picture: data.author.picture,
            fullName: data.author.fullName,
          },
        }}
        containerCss={{
          alignItems: 'flex-start',
        }}
      />
      <div className="d-flex flex-column flex1">
        <span>{data.author.fullName}</span>
        <small className="small">
          {`add a ${type} the ${moment(data.createdAt).format(
            'DD/MM/YYYY',
          )} at ${moment(data.createdAt).format('hh:mm')} `}
        </small>
        <div className="tab-content-children">{children}</div>
      </div>
    </header>
  </li>
);

TabContent.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

TabContent.defaultProps = {
  children: null,
};
export default TabContent;
