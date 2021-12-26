import React from 'react';
import { connect } from "react-redux";
// ACTIONS
import { hideModal } from "../../store/actions/modalActions";

const Modal = ({ active, content, hideModal, params }) => {
  
  const {
    danger
    , sideFunction
    , choice
  } = Boolean(params) && params;// Boolean because undefined causes error

  const handleClick = () => {
    sideFunction && sideFunction();
    hideModal();
  }

  const cancel = () => {
    hideModal();
  }

  return (
    <div className={`modal-wrapper${ active ? " active" : "" }${ danger ? " danger" : "" }`}>
      <div className="modal board">
        <p className="txt-center"><i className={`fas fa-${ danger ? "exclamation-triangle" : "info-circle" }`}></i></p>
        <p>{ content }</p>
        {/* The below "btws-wrapper" is exception */}
        <div className="btns-wrapper">
          <button className={`btn round-corners ${danger ? "danger" : null}`} onClick={ handleClick }>{danger ? "Yes, i understand." : "Ok"}</button>
          { choice && <button className="btn  round-corners" style={{background:"var(--first-color)"}} onClick={ cancel }>cancel</button> }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return ({
    active: state.modal.active
    , content: state.modal.content
    , params: state.modal.params
  });
};

const mapDispatchToProps = (dispatch) => ({ hideModal: () => dispatch(hideModal()) });

export default connect(mapStateToProps, mapDispatchToProps)(Modal);