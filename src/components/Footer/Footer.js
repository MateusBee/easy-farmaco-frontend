/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import FavoriteIcon from '@material-ui/icons/Favorite';

import styles from "./style.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
        <span>
            Made with
            <FavoriteIcon className={classes.heart} />
            by
            <strong> Mateus Bêe</strong>
        </span>
        </p>
      </div>
    </footer>
  );
}
