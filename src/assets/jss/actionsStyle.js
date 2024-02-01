import {
  primaryColor,
  successColor,
  dangerColor,
  grayColor,
} from "assets/jss/globalMaterial.js";
  
const actionsStyle = {
  tableActions: {
    display: "flex",
    border: "none",
    padding: "12px 8px !important",
    verticalAlign: "middle",
  },
  medicines: {
    backgroundColor: "transparent",
    color: primaryColor[0],
    boxShadow: "none",
  },
  edit: {
    backgroundColor: "transparent",
    color: successColor[0],
    boxShadow: "none",
  },
  visibility: {
    backgroundColor: "transparent",
    color: primaryColor[0],
    boxShadow: "none",
  },
  download: {
    backgroundColor: "transparent",
    color: grayColor[0],
    boxShadow: "none",
  },
  remove: {
    backgroundColor: "transparent",
    color: dangerColor[0],
    boxShadow: "none",
  },
  cancel: {
    marginRight: 10,
  }
};

export default actionsStyle;
