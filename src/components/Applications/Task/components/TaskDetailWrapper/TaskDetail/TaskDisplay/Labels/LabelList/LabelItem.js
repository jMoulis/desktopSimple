import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const LabelItem = ({ label }) => {
  return (
    <li className="label-list-item">
      <div
        className="label-list-item-content"
        style={{
          backgroundColor: 'red',
        }}
      >
        <span className="no-user-select">{label}</span>
        <span>
          <i className="fas fa-check" />
        </span>
      </div>
      <div className="label-list-item-edit">
        <i className="fas fa-pencil-alt" />
      </div>
    </li>
  );
};

LabelItem.propTypes = {};

export default LabelItem;
