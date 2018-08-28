import React, { Fragment } from 'react';
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
    sortingAction: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    sortingAction: null,
  };

  state = {
    search: {
      filter: '',
    },
    sorting: 1,
    asc: true,
  };

  handleSearchOption = menu => {
    this.setState(
      prevState => ({
        ...prevState,
        search: {
          ...prevState.search,
          [Object.keys(menu.filterValue)[0]]: Object.values(
            menu.filterValue,
          )[0],
        },
      }),
      () => {
        menu.action({ ...this.state.search });
      },
    );
  };

  handleInputChange = evt => {
    const { value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      search: {
        ...prevState.search,
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
          ...this.state.search,
          sorting: this.state.sorting,
        }),
    );
  };
  render() {
    const { menus, children } = this.props;
    const { search } = this.state;
    return (
      <div className="app-toolbar d-flex flex-justify-between flex-align-items-center">
        {children}
        <ul className="app-toolbar-list">
          {menus &&
            menus.map((menu, index) => {
              if (menu.searchField) {
                return (
                  <li key={index} className="app-toolbar-list-item">
                    <form
                      onSubmit={evt => {
                        evt.preventDefault();
                        menu.action({ ...search });
                      }}
                      className="app-toolbar-list-item-form"
                    >
                      <Input
                        config={{
                          field: {
                            type: 'text',
                            name: 'search',
                            placeholder: menu.searchFieldLabel,
                          },
                          onChange: this.handleInputChange,
                          value: this.state.search.filter,
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
              if (menu.sorting) {
                return (
                  <li key={index}>
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
              // return (
              //   <li key={index} className="app-toolbar-list-item">
              //     <button onClick={() => this.handleSearchOption(menu)}>
              //       {menu.label}
              //     </button>
              //   </li>
              // );
            })}
        </ul>
      </div>
    );
  }
}

export default AppToolbar;
