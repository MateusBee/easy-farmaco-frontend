/*eslint-disable*/
import React from "react";
import { withSnackbar } from 'notistack';

// Services
import { getToken, resetPassword } from 'services/auth';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/Input/Text.js";
import Button from "components/Button/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Muted from "components/Typography/Muted.js";
import Success from "components/Typography/Success.js";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import Key from '@material-ui/icons/VpnKey';

import styles from "./style.js";
import logoImage from 'assets/img/logo.png';

const useStyles = makeStyles(styles);

function getSteps() {
  return ['Informar email', 'Alterar senha'];
}

function Password({ history, enqueueSnackbar }) {
  const classes = useStyles();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  };

  const [values, setValues] = React.useState(initialValues);

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleClean = () => {
    setValues(initialValues);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    setValues({ ...values, [name]: event.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const data = {
        email: values.email,
      }
      getToken(data);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      handleSave();
    }
  };

  const handleCancel = () => {
    history.push("auth/login");
  };

  const handleSave = () => {
    if(values.password !== values.confirmPassword) {
      enqueueSnackbar('Oops! Parece que as senhas estão diferentes.', { variant: 'error' });
      return;
    }

    const data = {
      email: values.email,
      password: values.password,
      token: values.token
    }
    // resetPassword(data)
    console.log("Mudou", data);
  }
  
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <>
          <span>Digite a informação abaixo para seguir com a recuperação da senha</span>
          <CustomInput
            labelText="Email..."
            id="email"
            formControlProps={{
              fullWidth: true,
              className: classes.formControlClassName
            }}
            inputProps={{
              required: true,
              name: "email",
              value: values.email,
              onChange: handleChange,
              endAdornment: (
                <InputAdornment position="end">
                  <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </>
      case 1:
        return  <>
          <CustomInput
            labelText="Nova Senha"
            id="password"
            formControlProps={{
              fullWidth: true,
              className: classes.formControlClassName
            }}
            inputProps={{
              type: "password",
              required: true,
              name: "password",
              value: values.password,
              onChange: handleChange,
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className={classes.inputAdornmentIcon}>
                    lock_outline
                  </Icon>
                </InputAdornment>
              )
            }}
          />
          <CustomInput
            labelText="Confirmar Senha"
            id="confirmPassword"
            formControlProps={{
              fullWidth: true,
              className: classes.formControlClassName
            }}
            inputProps={{
              type: "password",
              required: true,
              name: "confirmPassword",
              value: values.confirmPassword,
              onChange: handleChange,
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className={classes.inputAdornmentIcon}>
                    lock_outline
                  </Icon>
                </InputAdornment>
              )
            }}
          />
          <CustomInput
            labelText="Token (enviado por email)"
            id="token"
            formControlProps={{
              fullWidth: true,
              className: classes.formControlClassName
            }}
            inputProps={{
              type: "token",
              required: true,
              name: "token",
              value: values.token,
              onChange: handleChange,
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className={classes.inputAdornmentIcon}>
                    <Key />
                  </Icon>
                </InputAdornment>
              )
            }}
          />
        </>
    }
  }


  return (
    <div className={classes.wrapper}>
      <div className={classes.fullPage}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
                <Card className={classes.shadow}>
                  <CardFooter>
                    <img src={logoImage} alt="logo" />
                  </CardFooter>
                  <CardBody>
                    {activeStep === steps.length ? (
                      <div className={classes.justifyContentCenter}>
                        <Success className={classes.instructions}>Senha Alterada com Sucesso</Success>
                        <Button onClick={handleCancel}>Voltar</Button>
                      </div>
                    ) : (
                      <div className={classes.textAlign}>
                        <Muted className={classes.instructions}>{getStepContent(activeStep)}</Muted>
                        <CardFooter>
                          <Button
                            onClick={handleCancel}
                            className={classes.backButton}
                          >
                            Cancelar
                          </Button>
                          <Button variant="contained" color="primary" onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Alterar' : 'Próximo'}
                          </Button>
                        </CardFooter>
                      </div>
                    )}
                  </CardBody>
                </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}

export default withSnackbar(Password);