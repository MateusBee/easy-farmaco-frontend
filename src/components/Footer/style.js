import {
  defaultFont,
  container,
  primaryColor,
  grayColor,
  dangerColor,
} from "assets/jss/globalMaterial.js";

const footerStyle = {
  right: {
    padding: "10px 0px 15px 0px",
    margin: "0",
    fontSize: "14px",
    float: "right!important",
  },
  footer: {
    bottom: "0",
    borderTop: "1px solid " + grayColor[11],
    padding: "15px 0",
    boxShadow: "0px -20px 20px -5px rgb(0 0 0 / 10%)",
    ...defaultFont,
  },
  container,
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent",
  },
  heart: {
    fontSize: "16px",
    padding: "0px 5px",
    color: dangerColor[0]
  }
};
export default footerStyle;
