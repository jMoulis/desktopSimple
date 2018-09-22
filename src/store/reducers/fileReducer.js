export const FETCH_FILE = 'FETCH_FILE';
export const FETCH_FILE_SUCCESS = 'FETCH_FILE_SUCCESS';
export const FETCH_FILE_FAILURE = 'FETCH_FILE_FAILURE';

const initialState = {
  fileProcess: {
    file: '',
    loading: false,
    error: null,
    success: '',
  },
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_FILE: {
      return {
        ...state,
        fileProcess: {
          ...state.fileProcess,
          loading: true,
        },
      };
    }
    case FETCH_FILE_SUCCESS: {
      return {
        ...state,
        fileProcess: {
          ...state.fileProcess,
          file: action.payload,
          loading: false,
          success: action.payload.success,
        },
      };
    }
    case FETCH_FILE_FAILURE: {
      return {
        ...state,
        fileProcess: {
          ...state.fileProcess,
          error: action.payload,
        },
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export const fetchFileAction = url => ({
  type: FETCH_FILE,
  payload: url,
});
export const fetchFileSuccessAction = file => ({
  type: FETCH_FILE_SUCCESS,
  payload: file,
});
export const fetchFileFailureAction = error => ({
  type: FETCH_FILE_FAILURE,
  payload: error,
});

export default reducer;
