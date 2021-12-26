const initState = { msgCreateErr: null };

const msgReducer = (state=initState, action) => {
  switch(action.type) {
    case "MESSAGE_CREATE_SUCCESS"
    : return ({ ...state, msgCreateErr: null });
    case "MESSAGE_CREATE_ERROR"
    : return ({ ...state, msgCreateErr: action.err.message });
    default
    : return state;
  }
}

export default msgReducer;