/*eslint-disable*/
import React from "react";
import { withSnackbar } from "notistack";

// Services
import { loginAuth } from "services/auth";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Link from "@material-ui/core/Link";
import Icon from "@material-ui/core/Icon";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/Input/Text.js";
import Button from "components/Button/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// @material-ui/icons
import Email from "@material-ui/icons/Email";

import styles from "./style.js";
import logoImage from "assets/img/logo.png";

const useStyles = makeStyles(styles);

function Login({ history, enqueueSnackbar }) {
  const classes = useStyles();

  const login = async e => {
    e.preventDefault();

    const fields = ["email", "password"];
    const formElements = e.target.elements;

    const formValues = fields
      .map(field => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));

    loginAuth(formValues).then(({data}) => {
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      history.push("/easy-farmaco/horarios");
    })
    .catch((e) => {
      enqueueSnackbar('Email ou senha incorreto', { variant: 'error' });
    })
  };

  const password = () => {
    history.push("/auth/password");
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.fullPage}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form onSubmit={login}>
                <Card className={classes.shadow}>
                  <CardFooter>
                    <img src={logoImage} alt="logo" />
                  </CardFooter>
                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        required: true,
                        name: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Senha..."
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "password",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    <Button type="submit" color="primary" size="lg" block>
                      Entrar
                    </Button>
                  </CardFooter>
                  <CardFooter className={classes.forgot}>
                    <Link underline="hover" className={classes.password} onClick={password}>
                      Esqueceu sua senha?
                    </Link>
                  </CardFooter>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(Login);