import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Modal from '@material-ui/core/Modal';

export default function Details(props) {
    const { open, handleClose, children } = props;
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {children}
      </Modal>
    )
}

Details.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    children: PropTypes.node,
  };