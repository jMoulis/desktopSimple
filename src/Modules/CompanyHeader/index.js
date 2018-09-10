import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.css';
import UserIconContainer from '../UserIcon';
import { ROOT_URL } from '../../Utils/config';

const CompanyHeader = ({ user, classNameContainer }) => (
  <div className={classNames('company', classNameContainer)}>
    <img
      className="company-logo"
      src={`${ROOT_URL}${user.company.picture}` || '/img/company-generic.png'}
      alt="logo company"
    />
    <div className="company-info">
      <p className="company-info-name">{user.company.companyName}</p>
      <div className="company-author">
        <UserIconContainer user={{ user }} classCss="middle" />
        <span>{user.fullName}</span>
      </div>
    </div>
  </div>
);

CompanyHeader.propTypes = {
  user: PropTypes.object.isRequired,
  classNameContainer: PropTypes.string,
};

CompanyHeader.defaultProps = {
  classNameContainer: '',
};

export default CompanyHeader;
