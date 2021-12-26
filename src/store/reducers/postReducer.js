const initState = {
  postCreateErr: null
};

const postReducer = (state=initState, action) => {
  switch(action.type) {
    case "POST_CREATE_SUCCESS"
    : return ({ ...state, postCreateErr: null });
    case "POST_CREATE_ERROR"
    : return ({ ...state, postCreateErr: action.err.message });
    default
    : return state;
  }
}

export default postReducer;