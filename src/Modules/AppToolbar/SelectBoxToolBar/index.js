import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const SelectBoxToolBar = ({ options, name, callback }) => (
  <select className="selectbox-toolbar" name={name} onChange={callback}>
    {options &&
      options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
  </select>
);

SelectBoxToolBar.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default SelectBoxToolBar;
