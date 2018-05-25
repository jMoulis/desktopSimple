import React from 'react';
import PropTypes from 'prop-types';

class ViewerToolbar extends React.Component {
  static propTypes = {
    setScaleValueAction: PropTypes.func.isRequired,
    closeViewerAction: PropTypes.func.isRequired,
    scaleValue: PropTypes.number.isRequired,
    pdf: PropTypes.string.isRequired,
  }
  handleZoom = (evt) => {
    const { id } = evt.currentTarget;
    const { setScaleValueAction, scaleValue } = this.props;

    this.setState((prevState) => {
      switch (id) {
        case 'minus':
          if (scaleValue <= 0.5) {
            return null;
          }
          return setScaleValueAction(-0.5);
        case 'plus':
          return setScaleValueAction(0.5);
        default:
          return {
            ...prevState,
          };
      }
    });
  }
  render() {
    const { closeViewerAction, pdf } = this.props;
    return (
      <ul className="btn-container">
        <li>
          <button
            className="viewer-toolbar-item"
            id="plus"
            type="button"
            onClick={this.handleZoom}
          >
            <i className="fas fa-search-plus" />
          </button>
          <button
            className="viewer-toolbar-item"
            id="minus"
            type="button"
            onClick={this.handleZoom}
          >
            <i className="fas fa-search-minus" />
          </button>
        </li>
        <li>
          <a
            className="viewer-toolbar-item"
            download
            href={pdf}
          >
            <i className="fas fa-download" />
          </a>
          <button
            className="viewer-toolbar-item viewer-toolbar-item--close"
            type="button"
            onClick={closeViewerAction}
          >
            <i className="fas fa-times-circle" />
          </button>
        </li>
      </ul>
    );
  }
}

export default ViewerToolbar;
