import React from 'react';
import PropTypes from 'prop-types';
import Input from '../../components/Form/input';
import './index.css';
import SubMenu from '../Submenu';

/**
 * A toolbar has many menus and subMenus
 *
 */
class AppToolbar extends React.Component {
  static propTypes = {
    menus: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sortingAction: PropTypes.func,
    liStyle: PropTypes.object,
    search: PropTypes.object,
  };

  static defaultProps = {
    menus: [],
    children: null,
    sortingAction: null,
    liStyle: null,
    search: null,
  };

  state = {
    searchValue: {},
    sorting: 1,
    asc: true,
    subMenu: {},
  };

  componentDidUpdate() {
    if (Object.keys(this.state.subMenu).length !== 0) {
      document.addEventListener('click', this._resetSubMenu);
    }
  }

  handleShowSubMenu = evt => {
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      subMenu: {
        ...prevState.subMenu,
        [name]: !prevState.subMenu[name],
      },
    }));
  };

  _resetSubMenu = evt => {
    if (!evt.target.dataset.toggle) {
      this.setState(prevState => ({
        ...prevState,
        subMenu: {},
      }));
    }
  };

  handleInputChange = evt => {
    const { value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      searchValue: {
        ...prevState.searchValue,
        filter: value,
      },
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
          ...this.state.searchValue,
          sorting: this.state.sorting,
        }),
    );
  };

  handleSubmit = evt => {
    const { searchValue } = this.state;
    const { search } = this.props;
    evt.preventDefault();
    search.action({ ...searchValue });
    // this.setState(() => ({
    //   searchValue: {
    //     filter: '',
    //   },
    // }));
  };

  render() {
    const { menus, children, liStyle, search } = this.props;
    const { searchValue, subMenu } = this.state;
    return (
      <div className="app-toolbar d-flex flex-justify-between flex-align-items-center">
        <ul className="app-toolbar-list">
          {menus &&
            menus.map((menu, index) => {
              if (menu.sorting && menu.show) {
                return (
                  <li key={index} style={liStyle}>
                    <button
                      className="btn-asc pointer d-flex"
                      onClick={this.handleSorting}
                      type="button"
                      title="Sorting by date"
                    >
                      <i className="absolute fas fa-sort-up fa-2x" />
                      <i className="fas fa-sort-down fa-2x" />
                    </button>
                  </li>
                );
              }
              if (menu.subMenu && menu.show) {
                return (
                  <li key={index} className="app-toolbar-list-item">
                    <button
                      className="btn-app-toolbar unselectable"
                      name={menu.name}
                      data-toggle="toggle"
                      onClick={this.handleShowSubMenu}
                    >
                      {menu.label}
                    </button>
                    {subMenu[menu.name] && <SubMenu menus={menu.subMenu} />}
                  </li>
                );
              }
              if (menu.show) {
                return (
                  <li key={index} className="app-toolbar-list-item">
                    <button
                      className="btn-app-toolbar unselectable"
                      name={menu.name}
                      data-toggle="toggle"
                      onClick={menu.action}
                    >
                      {menu.label}
                    </button>
                  </li>
                );
              }
              return null;
            })}
        </ul>

        {search &&
          search.show && (
            <div className="search" style={liStyle}>
              {children}
              <form
                onSubmit={this.handleSubmit}
                className="app-toolbar-list-item-form"
              >
                <Input
                  config={{
                    field: {
                      type: 'text',
                      name: 'search',
                      placeholder: search.searchFieldLabel,
                    },
                    onChange: this.handleInputChange,
                    value: searchValue.filter || '',
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
            </div>
          )}
      </div>
    );
  }
}

export default AppToolbar;
