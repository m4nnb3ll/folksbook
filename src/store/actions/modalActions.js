export const showModal = (content, params) => {

  return (dispatch) => {
    dispatch({
      type: "MODAL_SHOW"
      , content
      , params
    });
  }
}

export const hideModal = () => {
  return (dispatch) => {
    dispatch({
      type: "MODAL_HIDE"
    });
  }
}