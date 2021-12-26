const initState = {
  content: ""
  , active: false
};

const modalReducer = (state=initState, action) => {
  switch(action.type) {
    case "MODAL_SHOW"
    : {
      return ({
        ...state
        , content: action.content
        , params: action.params
        , active: true
      });
    }
    case "MODAL_HIDE"
    : {
      return ({
        ...state
        , content: ""
        , active: false
      });
    }
    default
    : return state;
  }
}

export default modalReducer;