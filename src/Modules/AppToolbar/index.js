import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Form/input';

/**
 * A toolbar has many menus and subMenus
 *
 */
class AppToolbar extends React.Component {
  state = {
    search: '',
    sorting: 1,
    asc: true,
  };

  handleSearchInput = evt => {
    const { name, value } = evt.target;
    this.setState(() => ({
      search: value,
    }));
  };

  handleSubmit = evt => {
    evt.preventDefault();
  };

  handleSorting = () => {
    const { sortingAction } = this.props;
    let sorting = -1;
    if (this.state.sorting === 1) {
      sorting = -1;
    } else {
      sorting = 1;
    }
    this.setState(
      prevState => ({
        ...prevState,
        sorting,
        asc: !prevState.asc,
      }),
      () =>
        sortingAction({
          search: this.state.search,
          sorting: this.state.sorting,
        }),
    );
  };
  render() {
    return (
      <div className="app-toolbar d-flex flex-justify-between flex-align-items-center">
        <ul className="app-toolbar-list">
          {this.props.menus.map(menu => (
            <li key={menu.label} className="app-toolbar-list-item">
              <button onClick={menu.action}>{menu.label}</button>
            </li>
          ))}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

AppToolbar.propTypes = {};

export default AppToolbar;
