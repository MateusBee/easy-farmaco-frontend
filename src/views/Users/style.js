import { primaryColor, grayColor } from "assets/jss/globalMaterial.js";
import tooltipStyle from "assets/jss/tooltipStyle.js";
import actionsStyle from "assets/jss/actionsStyle.js";
import searchStyle from "assets/jss/searchStyle.js";
    
const usersStyle = () => ({
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
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "0px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
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
});

export default usersStyle;
  