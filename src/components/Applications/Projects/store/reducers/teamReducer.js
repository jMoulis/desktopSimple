/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_SINGLE_TEAM = 'FETCH_SINGLE_TEAM';
export const FETCH_SINGLE_TEAM_SUCCESS = 'FETCH_SINGLE_TEAM_SUCCESS';
export const FETCH_SINGLE_TEAM_FAILURE = 'FETCH_SINGLE_TEAM_FAILURE';

export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = 'FETCH_TEAMS_FAILURE';

export const CREATE_TEAM = 'CREATE_TEAM';
export const CREATE_TEAM_SUCCESS = 'CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = 'CREATE_TEAM_FAILURE';

export const EDIT_TEAM = 'EDIT_TEAM';
export const EDIT_TEAM_SUCCESS = 'EDIT_TEAM_SUCCESS';
export const EDIT_TEAM_FAILURE = 'EDIT_TEAM_FAILURE';

export const CLEAR_TEAM_MESSAGE = 'CLEAR_TEAM_MESSAGE';


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
    case CREATE_TEAM: {
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
    case CREATE_TEAM_SUCCESS: {
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
    case CREATE_TEAM_FAILURE: {
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
    case FETCH_TEAMS: {
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
    case FETCH_TEAMS_SUCCESS: {
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
    case FETCH_TEAMS_FAILURE: {
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
    case FETCH_SINGLE_TEAM: {
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
    case FETCH_SINGLE_TEAM_SUCCESS: {
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
    case FETCH_SINGLE_TEAM_FAILURE: {
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
    case EDIT_TEAM: {
      return {
        ...state,
      };
    }
    case EDIT_TEAM_SUCCESS: {
      /**
       * The response is only the field modify
       */
      const { field, value, id } = action.payload.team;
      const { teams } = state.teamListProcess;
      // Update the team in the teams list
      // to update the teams list page
      const teamsUpdated = teams.map((team) => {
        if (team._id === id) {
          return {
            ...team,
            [field]: value,
          };
        }
        return team;
      });
      return {
        ...state,
        teamListProcess: {
          teams: teamsUpdated,
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case EDIT_TEAM_FAILURE: {
      return {
        ...state,
        activeTeamProcess: {
          ...state.activeTeamProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case CLEAR_TEAM_MESSAGE: {
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
  type: FETCH_SINGLE_TEAM,
  teamId,
});
export const fetchSingleTeamSuccessAction = data => ({
  type: FETCH_SINGLE_TEAM_SUCCESS,
  payload: data,
});
export const fetchSingleTeamFailureAction = error => ({
  type: FETCH_SINGLE_TEAM_FAILURE,
  payload: error,
});
export const fetchTeamsAction = id => ({
  type: FETCH_TEAMS,
  id,
});
export const fetchTeamsSuccessAction = data => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: data,
});
export const fetchTeamsFailureAction = error => ({
  type: FETCH_TEAMS_FAILURE,
  payload: error,
});
export const editTeamAction = updates => ({
  type: EDIT_TEAM,
  payload: updates,
});
export const editTeamSuccessAction = data => ({
  type: EDIT_TEAM_SUCCESS,
  payload: data,
});
export const editTeamFailureAction = error => ({
  type: EDIT_TEAM_FAILURE,
  payload: error,
});
export const createTeamAction = values => ({
  type: CREATE_TEAM,
  payload: values,
});
export const createTeamSuccessAction = data => ({
  type: CREATE_TEAM_SUCCESS,
  payload: data,
});
export const createTeamFailureAction = error => ({
  type: CREATE_TEAM_FAILURE,
  payload: error,
});
export const clearTeamMessageAction = () => ({
  type: CLEAR_TEAM_MESSAGE,
});
/*
 * Export default
*/
export default reducer;
