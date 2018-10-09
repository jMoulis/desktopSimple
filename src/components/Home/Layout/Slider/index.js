import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class Slider extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
    // this.setState(prevState => ({
    //   data: this.passFirstToLast(prevState.data),
    // }));
    // this.timer = setInterval(() => {
    //   this.setState(prevState => ({
    //     data: this.passFirstToLast(prevState.data),
    //   }));
    // }, 150000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  passFirstToLast = array => {
    const itemsDeleted = array.slice(0, 4);
    const newArray = [...array.slice(4)];
    newArray.push(...itemsDeleted);
    return newArray;
  };

  render() {
    const { data } = this.state;
    const { children } = this.props;
    return (
      <div className="slider">
        <ul className="slider-list d-flex flex-wrap">
          {data.map((item, index) =>
            React.Children.map(children, child =>
              React.cloneElement(child, { item }),
            ),
          )}
        </ul>
      </div>
    );
  }
}

export default Slider;
