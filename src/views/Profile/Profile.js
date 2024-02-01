/*eslint-disable*/
import React from "react";
import { withSnackbar } from 'notistack';

// Services
import { updateUser, resetPassword } from "services/user";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/Input/Text.js";
import Button from "components/Button/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "./style.js";

const useStyles = makeStyles(styles);

function Profile({ enqueueSnackbar }) {
  const classes = useStyles();

  const initialValues = {
    name: "",
    email: "",
    cpf: "",
    landline: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const initialAddress = {
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    number: "",
    complement: "",
  };
  const [values, setValues] = React.useState(initialValues);
  const [address, setAddress] = React.useState(initialAddress);

  const handleChange = (event) => {
    const name = event.target.name;
    setValues({ ...values, [name]: event.target.value});
  }

  const handleChangeAddress = (event) => {
    const name = event.target.name;
    setAddress({ ...address, [name]: event.target.value });
  };

  const handleFields = (fields, formElements) => fields
    .map(field => ({
      [field]: formElements.namedItem(field).value
    }))
    .reduce((current, next) => ({ ...current, ...next }));

  const save = async e => {
    e.preventDefault();

    const fields = [
      "name", "email", "cpf",
      "landline", "phone",
    ];
    const fieldsAddress = [
      "cep", "street", "neighborhood",
      "city", "number", "complement"
    ];
    const formElements = e.target.elements;

    const formValues = handleFields(fields, formElements);
    const formAddress = handleFields(fieldsAddress, formElements);

    const data = {
      ...formValues,
      address: { _id: address._id, ...formAddress },
    };

    updateUser(values._id, data).then(({data}) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      enqueueSnackbar('Usuário atualizado com sucesso', { variant: 'success' });
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível atualizar o usuário', { variant: 'error' });
    })
  };

  const changePassword = async e => {
    e.preventDefault();

    if(values.newPassword !== values.confirmPassword) {
      enqueueSnackbar('Oops! Parece que as novas senhas estão diferentes', { variant: 'error' });
      return;
    }

    const fields = [
      "currentPassword", "newPassword", "confirmPassword",
    ];
    const formElements = e.target.elements;

    const formValues = handleFields(fields, formElements);

    const data = {
      _id: values._id,
      current: formValues.currentPassword,
      password: formValues.newPassword,
    }

    resetPassword(data).then(() => {
      enqueueSnackbar('Senha alterada com sucesso', { variant: 'success' });
      setValues({
        ...values,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    })
    .catch((data) => {
      const error = data.response.data.error;
      enqueueSnackbar(`Oops! ${error}`, { variant: 'error' });
    })
  }

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setAddress(user.address);
    delete user.address;
    setValues({ ...values, ...user });
  }, []);

  return (
    <GridContainer>
      <Card>
        <form onSubmit={save}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Dados Pessoais</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Nome"
                  id="name"
                  inputProps={{
                    required: true,
                    name: "name",
                    value: values.name,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Email"
                  id="email"
                  inputProps={{
                    required: true,
                    name: "email",
                    value: values.email,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="CPF*"
                  id="cpf"
                  inputProps={{
                    required: true,
                    name: "cpf",
                    value: values.cpf,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Telefone Fixo"
                  id="landline"
                  inputProps={{
                    name: "landline",
                    value: values.landline,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Telefone Celular"
                  id="phone"
                  inputProps={{
                    required: true,
                    name: "phone",
                    value: values.phone,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="CEP*"
                  id="cep"
                  inputProps={{
                    required: true,
                    name: "cep",
                    value: address.cep,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Rua*"
                  id="street"
                  inputProps={{
                    required: true,
                    name: "street",
                    value: address.street,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Bairro*"
                  id="neighborhood"
                  inputProps={{
                    required: true,
                    name: "neighborhood",
                    value: address.neighborhood,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Cidade*"
                  id="city"
                  inputProps={{
                    required: true,
                    name: "city",
                    value: address.city,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Número*"
                  id="number"
                  inputProps={{
                    required: true,
                    name: "number",
                    value: address.number,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Complemento"
                  id="complement"
                  inputProps={{
                    name: "complement",
                    value: address.complement,
                    onChange: handleChangeAddress,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <div/>
            <Button color="primary" type="submit">Salvar</Button>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <form onSubmit={changePassword}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Alterar Senha</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Senha Atual"
                  id="currentPassword"
                  inputProps={{
                    required: true,
                    name: "currentPassword",
                    type: "password",
                    value: values.currentPassword,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Nova Senha"
                  id="newPassword"
                  inputProps={{
                    required: true,
                    name: "newPassword",
                    type: "password",
                    value: values.newPassword,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Confirmar Senha"
                  id="confirmPassword"
                  inputProps={{
                    required: true,
                    name: "confirmPassword",
                    type: "password",
                    value: values.confirmPassword,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <div/>
            <Button color="primary" type="submit">Alterar</Button>
          </CardFooter>
        </form>
      </Card>
    </GridContainer>
  );
}

export default withSnackbar(Profile);