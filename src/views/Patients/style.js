import { grayColor, primaryColor } from "assets/jss/globalMaterial.js";
import tooltipStyle from "assets/jss/tooltipStyle.js";
import actionsStyle from "assets/jss/actionsStyle.js";
import searchStyle from "assets/jss/searchStyle.js";
    
const patientsStyle = () => ({
  ...tooltipStyle,
  ...actionsStyle,
  ...searchStyle,
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  text: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0",
  },
  info: {
    marginLeft: "7px",
  },
  formControl: {
    paddingBottom: "10px",
    margin: "10px 0 0 0",
    position: "relative",
    verticalAlign: "unset",
  },
  root: {
    '& label.Mui-focused': {
      color: primaryColor[0],
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: primaryColor[0],
    },
  },
  divider: {
    margin: "15px 0px",
  },
  item: {
    backgroundColor: "#F5F5F5",
    borderRadius: "7px",
    padding: "6px 0px 6px 0px",
    marginBottom: "10px",
  }
});

export default patientsStyle;
  