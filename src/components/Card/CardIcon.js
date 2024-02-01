import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";

import styles from "./jss/cardIconStyle.js";

const useStyles = makeStyles((theme) => ({
  ...styles,
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function CardIcon(props) {
  const classes = useStyles();
  const { className, image, ...rest } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [className]: className !== undefined,
  });
  return (
    <div className={cardIconClasses} {...rest}>
      <Avatar alt="user" className={classes.large} src={image}/>
    </div>
  );
}

CardIcon.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string,
};
