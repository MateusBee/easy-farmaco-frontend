import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/Button/Button.js";

const styles = {
    cancel: {
        marginRight: "10px",
    },
};

const useStyles = makeStyles(styles);

export default function Details(props) {
    const classes = useStyles();
    const { open, handleClose, handleConfirm, title, body } = props;
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader color="danger">
                                {title}
                            </CardHeader>
                            <CardBody>
                                {body}
                            </CardBody>
                            <CardFooter stats>
                                <div/>
                                <div>
                                    <Button
                                        className={classes.cancel}
                                        onClick={handleClose}>Cancelar</Button>
                                    <Button
                                        color="danger"
                                        onClick={handleConfirm}>Excluir</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </GridContainer>
            </>
      </Modal>
    )
}

Details.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
    title: PropTypes.string,
    body: PropTypes.string,
  };