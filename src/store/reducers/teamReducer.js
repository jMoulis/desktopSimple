/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const GLOBAL_FETCH_SINGLE_TEAM = 'GLOBAL_FETCH_SINGLE_TEAM';
export const GLOBAL_FETCH_SINGLE_TEAM_SUCCESS = 'GLOBAL_FETCH_SINGLE_TEAM_SUCCESS';
export const GLOBAL_FETCH_SINGLE_TEAM_FAILURE = 'GLOBAL_FETCH_SINGLE_TEAM_FAILURE';

export const GLOBAL_FETCH_TEAMS = 'GLOBAL_FETCH_TEAMS';
export const GLOBAL_FETCH_TEAMS_SUCCESS = 'GLOBAL_FETCH_TEAMS_SUCCESS';
export const GLOBAL_FETCH_TEAMS_FAILURE = 'GLOBAL_FETCH_TEAMS_FAILURE';

export const GLOBAL_CREATE_TEAM = 'GLOBAL_CREATE_TEAM';
export const GLOBAL_CREATE_TEAM_SUCCESS = 'GLOBAL_CREATE_TEAM_SUCCESS';
export const GLOBAL_CREATE_TEAM_FAILURE = 'GLOBAL_CREATE_TEAM_FAILURE';

export const GLOBAL_EDIT_TEAM = 'GLOBAL_EDIT_TEAM';
export const GLOBAL_EDIT_TEAM_SUCCESS = 'GLOBAL_EDIT_TEAM_SUCCESS';
export const GLOBAL_EDIT_TEAM_FAILURE = 'GLOBAL_EDIT_TEAM_FAILURE';

export const GLOBAL_DELETE_TEAM = 'GLOBAL_DELETE_TEAM';
export const GLOBAL_DELETE_TEAM_SUCCESS = 'GLOBAL_DELETE_TEAM_SUCCESS';
export const GLOBAL_DELETE_TEAM_FAILURE = 'GLOBAL_DELETE_TEAM_FAILURE';

export const GLOBAL_CLEAR_TEAM_MESSAGE = 'GLOBAL_CLEAR_TEAM_MESSAGE';


/*
 * State
*/
const initialState = {
  teamCreation: {
    team: {},
    success: null,
    loading: true,
    error: null,
  },
  teamListProcess: {
    teams: [],
    success: null,
    loading: true,
    error: null,
  },
  activeTeamProcess: {
    team: {},
    success: null,
    loading: true,
    error: null,
  },
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GLOBAL_CREATE_TEAM: {
      return {
        ...state,
        teamCreation: {
          team: {},
          loading: true,
          error: null,
          success: null,
        },
      };
    }
    case GLOBAL_CREATE_TEAM_SUCCESS: {
      return {
        ...state,
        teamCreation: {
          team: action.payload.team,
          loading: false,
          error: null,
          success: action.payload.success,
        },
        teamListProcess: {
          ...state.teamListProcess,
          teams: [
            action.payload.team,
            ...state.teamListProcess.teams,
          ],
        },
      };
    }
    case GLOBAL_CREATE_TEAM_FAILURE: {
      return {
        ...state,
        teamCreation: {
          team: {},
          loading: false,
          error: action.payload,
          success: null,
        },
      };
    }
    case GLOBAL_FETCH_TEAMS: {
      return {
        ...state,
        teamListProcess: {
          teams: [],
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case GLOBAL_FETCH_TEAMS_SUCCESS: {
      return {
        ...state,
        teamListProcess: {
          teams: action.payload.teams,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case GLOBAL_FETCH_TEAMS_FAILURE: {
      return {
        ...state,
        teamListProcess: {
          teams: [],
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case GLOBAL_FETCH_SINGLE_TEAM: {
      return {
        ...state,
        activeTeamProcess: {
          team: {},
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case GLOBAL_FETCH_SINGLE_TEAM_SUCCESS: {
      return {
        ...state,
        activeTeamProcess: {
          team: action.payload.team,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case GLOBAL_FETCH_SINGLE_TEAM_FAILURE: {
      return {
        ...state,
        activeTeamProcess: {
          team: {},
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case GLOBAL_EDIT_TEAM: {
      return {
        ...state,
      };
    }
    case GLOBAL_EDIT_TEAM_SUCCESS: {
      return {
        ...state,
        activeTeamProcess: {
          team: action.payload.team,
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case GLOBAL_EDIT_TEAM_FAILURE: {
      return {
        ...state,
        activeTeamProcess: {
          ...state.activeTeamProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case GLOBAL_DELETE_TEAM: {
      return {
        ...state,
      };
    }
    case GLOBAL_DELETE_TEAM_SUCCESS: {
      return {
        ...state,
        activeTeamProcess: {
          team: {},
          success: null,
          loading: false,
          error: null,
        },
        teamListProcess: {
          teams: action.payload.teams,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case GLOBAL_DELETE_TEAM_FAILURE: {
      return {
        ...state,
        activeTeamProcess: {
          ...state.activeTeamProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case GLOBAL_CLEAR_TEAM_MESSAGE: {
      return {
        ...state,
        teamCreation: {
          team: {},
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
};

/*
 *Action creators
 */

export const fetchSingleTeamAction = teamId => ({
  type: GLOBAL_FETCH_SINGLE_TEAM,
  teamId,
});
export const fetchSingleTeamSuccessAction = data => ({
  type: GLOBAL_FETCH_SINGLE_TEAM_SUCCESS,
  payload: data,
});
export const fetchSingleTeamFailureAction = error => ({
  type: GLOBAL_FETCH_SINGLE_TEAM_FAILURE,
  payload: error,
});
export const fetchTeamsAction = id => ({
  type: GLOBAL_FETCH_TEAMS,
  id,
});
export const fetchTeamsSuccessAction = data => ({
  type: GLOBAL_FETCH_TEAMS_SUCCESS,
  payload: data,
});
export const fetchTeamsFailureAction = error => ({
  type: GLOBAL_FETCH_TEAMS_FAILURE,
  payload: error,
});
export const editTeamAction = updates => ({
  type: GLOBAL_EDIT_TEAM,
  payload: updates,
});
export const editTeamSuccessAction = data => ({
  type: GLOBAL_EDIT_TEAM_SUCCESS,
  payload: data,
});
export const editTeamFailureAction = error => ({
  type: GLOBAL_EDIT_TEAM_FAILURE,
  payload: error,
});
export const createTeamAction = values => ({
  type: GLOBAL_CREATE_TEAM,
  payload: values,
});
export const createTeamSuccessAction = data => ({
  type: GLOBAL_CREATE_TEAM_SUCCESS,
  payload: data,
});
export const createTeamFailureAction = error => ({
  type: GLOBAL_CREATE_TEAM_FAILURE,
  payload: error,
});
export const clearTeamMessageAction = () => ({
  type: GLOBAL_CLEAR_TEAM_MESSAGE,
});
export const deleteTeamAction = teamId => ({
  type: GLOBAL_DELETE_TEAM,
  teamId,
});
export const deleteTeamSuccessAction = data => ({
  type: GLOBAL_DELETE_TEAM_SUCCESS,
  payload: data,
});
export const deleteTeamFailureAction = error => ({
  type: GLOBAL_DELETE_TEAM_FAILURE,
  payload: error,
});
/*
 * Export default
*/
export default reducer;
