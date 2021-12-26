const initState = {
  selectedNavTab: null
};

const navTabReducer = (state=initState, action) => {
  switch(action.type) {
    case "SELECT_NAV_TAB"
    : {
      return action.navTab
        ? action.navTab === state.selectedNavTab
          ? ({
            ...state
            , selectedNavTab: null
          })
          : ({
            ...state
            , selectedNavTab: action.navTab
          })
        : ({// if action.navTab is empty
          ...state
          , selectedNavTab: null // to hide all shown tabs
        });
    }
    default
    : return state;
  }
}

export default navTabReducer;