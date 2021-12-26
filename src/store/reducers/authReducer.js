// FUNCTIONS
import stripFB from "../../myPlugins/functions/stripFB";

const initState = {
  signInErr: ""
  , signUpErr: ""
};

const authReducer = (state=initState, action) => {
  switch(action.type) {
    case "SIGN_IN_SUCCESS"
    : return ({ ...state, signInErr: "" });
    case "SIGN_IN_ERROR"
    : return ({ ...state, signInErr: stripFB(action.err.message) });
    case "CLEAR_SIGN_IN_ERROR"
    : return ({ ...state, signInErr: "" });
    case "SIGN_UP_SUCCESS"
    : return ({ ...state, signUpErr: "" });
    case "SIGN_UP_ERROR"
    : return ({ ...state, signUpErr: stripFB(action.err.message) });
    case "CLEAR_SIGN_UP_ERROR"
    : return ({ ...state, signUpErr: "" });
    case "SIGN_OUT_SUCCESS"
    : { window.location.reload(); return state; }
    default
    : return state;
  }
}

export default authReducer;