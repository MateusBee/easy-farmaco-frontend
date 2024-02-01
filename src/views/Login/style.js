import {
  whiteColor,
  grayColor,
  blackColor,
  boxShadow,
} from "assets/jss/globalMaterial.js";
  
const loginStyle = theme => ({
  wrapper: {
    height: "auto",
    minHeight: "100vh",
    position: "relative",
    top: "0"
  },
  fullPage: {
    //padding: "120px 0",
    position: "relative",
    minHeight: "100vh",
    display: "flex!important",
    margin: "0",
    border: "0",
    color: whiteColor,
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundColor: "transparent",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      minHeight: "fit-content!important"
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
      border: "none !important"
    },
    "&:before,&:after": {
      display: "block",
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      zIndex: "2"
    }
  },
  container: {
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
    "@media (min-width: 768px)": {
      width: "750px"
    },
    "@media (min-width: 992px)": {
      width: "970px"
    },
    "@media (min-width: 1200px)": {
      width: "1170px"
    },
    "&:before,&:after": {
      display: "table",
      content: '" "'
    },
    "&:after": {
      clear: "both"
    },
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  shadow: {
    ...boxShadow,
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  forgot: {
    display: "flex",
    justifyContent: "center"
  },
  password: {
    textTransform: "inherit !important",
    color: `${blackColor} !important`,
    cursor: "pointer !important",
  },
  inputAdornmentIcon: {
    color: grayColor[6]
  },
  formControlClassName: {
    margin: "10px 0px",
    paddingBottom: "0",
    "& + $formControlClassName": {
      marginTop: "5px"
    }
  },
});

export default loginStyle;
  