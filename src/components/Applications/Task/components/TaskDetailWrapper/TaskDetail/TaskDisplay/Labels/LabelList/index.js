import React from 'react';
import PropTypes from 'prop-types';
import LabelItem from './LabelItem';
import './index.css';

const LabelList = ({ labels }) => {
  return (
    <ul className="label-list">
      {labels.map(label => <LabelItem label={label} />)}
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
      <li>Add a label</li>
    </ul>
  );
};

LabelList.propTypes = {};

export default LabelList;
