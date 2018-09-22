import React from 'react';
import PropTypes from 'prop-types';

import Button from './button';

const FormButtonsContainer = ({ onCancel, onCreate, onEdit }) => (
  <div>
    {onCancel && (
      <Button
        type="button"
        category="secondary"
        onClick={onCancel.action}
        label="Cancel"
        loading={false}
      />
    )}
    {onCreate && (
      <Button type="submit" category="primary" label="Create" loading={false} />
    )}
    {onEdit && (
      <Button type="submit" category="secondary" label="Edit" loading={false} />
    )}
  </div>
);

FormButtonsContainer.propTypes = {
  onCancel: PropTypes.object,
  onCreate: PropTypes.bool,
  onEdit: PropTypes.bool,
};

FormButtonsContainer.defaultProps = {
  onCancel: null,
  onCreate: null,
  onEdit: null,
};

export default FormButtonsContainer;
