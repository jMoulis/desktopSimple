import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Form/input';
import './index.css';

/**
 * A toolbar has many menus and subMenus
 *
 */
class AppToolbar extends React.Component {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    children: PropTypes.shape(PropTypes.array, PropTypes.object),
    action: PropTypes.func,
    sortingAction: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    action: null,
    sortingAction: null,
  };

  state = {
    search: '',
    sorting: 1,
    asc: true,
  };

  handleSearchInput = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      search: value,
    }));
  };

  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
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
    const { menus, children } = this.props;
    return (
      <div className="app-toolbar d-flex flex-justify-between flex-align-items-center">
        <ul className="app-toolbar-list">
          {menus.map((menu, index) => {
            if (menu.search) {
              return (
                <li key={index} className="app-toolbar-list-item">
                  <form
                    onSubmit={evt => {
                      evt.preventDefault();
                      menu.action({ filter: this.state.search });
                    }}
                    className="app-toolbar-list-item-form"
                  >
                    <Input
                      config={{
                        field: {
                          type: 'text',
                          name: 'search',
                          placeholder: 'Search',
                        },
                        onChange: this.handleInputChange,
                        value: this.state.search,
                        className: 'app-toolbar-list-item-form-input-search',
                        parentClassName:
                          'app-toolbar-list-item-form-input-search-container',
                      }}
                    />
                    <button
                      className="app-toolbar-list-item-form-input-search-icon"
                      type="submit"
                    >
                      <i className="fas fa-search" />
                    </button>
                  </form>
                </li>
              );
            }
            return (
              <li key={index} className="app-toolbar-list-item">
                <button onClick={menu.action}>{menu.label}</button>
              </li>
            );
          })}
        </ul>
        {children}
      </div>
    );
  }
}

export default AppToolbar;
