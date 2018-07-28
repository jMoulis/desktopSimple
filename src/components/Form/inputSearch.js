import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ROOT_URL } from '../../Utils/config';
import SuccessIcon from '../../assets/successIcon/successIcon';

import './inputSearch.css';

class InputSearch extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired,
    metaName: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      [props.config.field.name]: {
        value: props.config.value,
      },
      metas: null,
    };
  }
  handleInputChange = async evt => {
    const { value, name } = evt.target;
    const { metaName } = this.props;
    try {
      if (value) {
        const { data } = await this.fetchmetas(metaName, value);
        this.setState(prevState => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            value,
            changed: true,
          },
          metas: data.metas,
        }));
      } else {
        this.setState(prevState => ({
          ...prevState,
          [name]: {
            value: '',
            changed: true,
          },
          metas: [],
        }));
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  handleBlur = evt => {
    const { value, name } = evt.target;
    if (this.state[name].changed) {
      this.setState(prevState => ({
        ...prevState,
        [name]: {
          ...prevState,
          value,
        },
        metas: [],
      }));
    }
  };
  // diplome_rgp discipline_lib
  handleSelect = evt => {
    const { metavalue } = evt.target.dataset;
    const { callback, metaName } = this.props;

    this.setState(
      prevState => ({
        ...prevState,
        [metaName]: {
          ...prevState[metaName],
          value: metavalue,
          changed: true,
        },
        metas: [],
      }),
      () => callback(this.state[metaName], metaName),
    );
  };
  fetchmetas = (metaName, metaValue) => {
    const metas = axios.get(
      `${ROOT_URL}/api/metas?metaName=${metaName}&metaValue=${metaValue}`,
    );
    return metas;
  };
  render() {
    const { metas } = this.state;
    const { config } = this.props;
    return (
      <div
        className={`form-group input-search ${
          config.field.required ? 'required' : ''
        }`}
      >
        <label htmlFor={config.field.name}>{config.field.label}</label>
        <input
          value={this.state[config.field.name].value}
          onChange={this.handleInputChange}
          type={config.field.type}
          name={config.field.name}
          id={config.field.name}
          placeholder={
            config.field.placeholder
              ? config.field.placeholder
              : config.field.label
          }
          className={`form-control ${config.error && 'form-control-error'}`}
          readOnly={config.readOnly}
          max={config.max}
          min={config.min}
          autoComplete="off"
          onBlur={this.handleBlur}
        />
        {metas && (
          <div className="input-search-box">
            <ul>
              {metas &&
                metas.map((meta, index) => (
                  <li
                    key={index}
                    data-metavalue={meta.metaValue}
                    onClick={this.handleSelect}
                    onKeyPress={this.handleSelect}
                  >
                    {meta.metaValue}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {config.success &&
          config.success === config.field.name && <SuccessIcon />}
        {config.small && <small className="tips">{config.small}</small>}
        {config.error && (
          <small className="error-message">{config.error}</small>
        )}
      </div>
    );
  }
}

export default InputSearch;
