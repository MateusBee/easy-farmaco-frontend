import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

// Services
import { getAll, createUser, updateUser, deleteUser } from 'services/user';
//import { getAll as getAllPatients } from 'services/patient';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from '@material-ui/core/MenuItem';
//import Autocomplete from '@material-ui/lab/Autocomplete';
//import TextField from '@material-ui/core/TextField';

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import CustomInput from "components/Input/Text.js";
import CustomSelect from "components/Input/Select.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/Button/Button.js";
import CardBody from "components/Card/CardBody.js";
import DeleteModal from 'components/Modal/Delete.js';

// @material-ui/icons
import Edit from '@material-ui/icons/Edit';
import Delete from "@material-ui/icons/Delete";
import Search from "@material-ui/icons/Search";

import styles from "./style.js";

const useStyles = makeStyles(styles);

function UsersList({ enqueueSnackbar }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [control, setControl] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [defaultData, setDefaultData] = React.useState([]);
  const [data, setData] = React.useState([]);

  const initialValues = {
    name: "",
    email: "",
    cpf: "",
    type: "",
    landline: "",
    phone: "",
    password: "",
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
  const [patients, setPatients] = React.useState([]);
  //const [options, setOptions] = React.useState([]);

  const getDataTable = () => {
    getAll().then(({data}) => {
      setData(data.data);
      setDefaultData(data.data);
    });
  };

//  const getPatients = () => {
//    getAllPatients().then(({data}) => {
//      setOptions(data.data);
//    });
//  };

  const handleClean = () => {
    setValues(initialValues);
    setAddress(initialAddress);
    setPatients([]);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeAddress = (event) => {
    const name = event.target.name;
    setAddress({ ...address, [name]: event.target.value });
  };

//  const handleChangeAutoComplete = (event, newInputValue) => {
//    setPatients(newInputValue);
//  };

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value === "") handleSearch(event.target.value);
  };

  const handleSearch = (aux = search) => {
    if (aux === "") {
      setData(defaultData);
      return;
    }
    const text = search.toUpperCase();
    const tableData = data.filter((d) => d.name.toUpperCase().includes(text));
    setData(tableData);
  };
  
  const handleModalUser = () => {
    setControl(true);
  };

  const handleOpenDelete = () => {
    setControl(false);
    setOpen(true);
  };

  const handleCancelUser = () => {
    setControl(false);
    handleClean();
  };

  const handleCancelDelete = () => {
    setOpen(false);
    handleClean();
  };

  const handleFormatEdit = (current) => {
    setValues({
      _id: current._id,
      name: current.name,
      cpf: current.cpf,
      email: current.email,
      type: current.type,
      phone: current.phone,
      landline: current.landline,
      password: "",
      confirmPassword: ""
    });
    setAddress(current.address);
    setPatients(current.patients);
  };

  const handleFields = (fields, formElements) => fields
    .map(field => ({
      [field]: formElements.namedItem(field).value
    }))
    .reduce((current, next) => ({ ...current, ...next }));

  const handleFormatType = (s) => {
    const type = {
      "Médico": 1,
      "Profissional da Área": 2,
      "Familiar": 3,
      "Administrador": 4,
      "Superusuário": 5
    };

    return type[s];
  };
    
  const handleSaveUser = async e => {
    e.preventDefault();

    if(values.password !== values.confirmPassword && !values._id) {
      enqueueSnackbar('Oops! Parece que as senhas estão diferentes.', { variant: 'error' });
      return;
    }

    let fields = [
      "name", "email", "cpf",
      "type", "landline", "phone",
    ];

    if(!values._id) fields = fields.concat(["password", "confirmPassword"])

    const fieldsAddress = [
      "cep", "street", "neighborhood",
      "city", "number", "complement"
    ];
    const formElements = e.target.elements;

    const formValues = handleFields(fields, formElements);
    const formAddress = handleFields(fieldsAddress, formElements);

    const data = {
      ...formValues,
      type: handleFormatType(formValues.type),
      patients,
      address: address._id ? { _id: address._id, ...formAddress } : formAddress,
    };

    if(values._id) handleUpdateUser(values._id, data);
    else handleCreateUser(data);

  };

  const handleUpdateUser = (id, data) => {
    updateUser(id, data).then(() => {
      handleCancelUser();
      enqueueSnackbar('Usuário atualizado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível atualizar o usuário', { variant: 'error' });
    })
  };

  const handleCreateUser = (data) => {
    createUser(data).then(() => {
      handleCancelUser();
      enqueueSnackbar('Usuário registrado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível cadastrar o usuário', { variant: 'error' });
    })
  };

  const handleConfirmDelete = () => {
    deleteUser(values._id).then(() => {
      enqueueSnackbar('Registro excluido com sucesso', { variant: 'success' });
      handleCancelDelete();
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível excluir esse registro', { variant: 'error' });
    })
  };

  React.useEffect(() => getDataTable(), []);

  //React.useEffect(() => getPatients(), []);

  const FormUsers = () =>
  <GridItem xs={12} sm={12} md={12}
    style={{
      position: control ? "relative" : "absolute",
      visibility: control ? "inherit" : "hidden"
    }}>
    <Card>
      <form onSubmit={handleSaveUser}>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Novo Usuário</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Nome*"
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
                labelText="Email*"
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
            <GridItem xs={12} sm={12} md={4}>
              <CustomSelect
                labelText="Perfil de Acesso*"
                id="type"
                inputProps={{
                  required: true,
                  name: "type",
                  value: `${values.type}`,
                  onChange: handleChange,
                }}
                formControlProps={{
                  fullWidth: true,
                }}
              >
                <MenuItem value="Médico">Médico</MenuItem>
                <MenuItem value="Profissional da Área">Profissional da Área</MenuItem>
                <MenuItem value="Familiar">Familiar</MenuItem>
                <MenuItem value="Administrador">Administrador</MenuItem>
              </CustomSelect>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
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
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Telefone Celular*"
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
          {
            !values._id && <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Senha*"
                  id="password"
                  inputProps={{
                    required: true,
                    name: "password",
                    type: "password",
                    value: values.password,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Confirmar Senha*"
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
          }
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              {/*<Autocomplete
                multiple
                fullWidth
                id="patients"
                name="patients"
                disabled={values.type !== "Familiar"}
                className={classes.formControl}
                options={options}
                //inputValue={patients}
                defaultValue={patients}
                onChange={handleChangeAutoComplete}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pacientes Vinculados"
                    name="patients"
                    helperText="Selecione os pacientes que deseja acompanhar."
                    classes={{
                      root: classes.root,
                    }}
                  />
                )}
                  />*/}
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
          <div>
            <Button
              className={classes.cancel}
              color="danger"
              onClick={handleCancelUser}>Cancelar</Button>
            <Button
              color="primary"
              type="submit">Salvar</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  </GridItem>

  return (
    <>
      <GridContainer>
        {FormUsers()}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardFooter>
              <Button
              color="primary"
              styles={{ marginTop: 10 }}
              onClick={handleModalUser}>Novo Usuário</Button>
              <div className={classes.searchWrapper}>
                <CustomInput
                  formControlProps={{
                    className: classes.margin + " " + classes.search,
                  }}
                  inputProps={{
                    type: "search",
                    placeholder: "Pesquisar",
                    inputProps: {
                      "aria-label": "Pesquisar",
                    },
                    onChange: handleChangeSearch
                  }}
                />
                <Button color="white" aria-label="edit" justIcon round
                  onClick={handleSearch}>
                  <Search />
                </Button>
              </div>
            </CardFooter>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  { name: "CPF", width: 150 },
                  { name: "Nome", width: 200 },
                  { name: "Email", width: 150 },
                  { name: "Perfil", width: 50 },
                  { name: "Ações", width: 50 },]}
                tablecells={["cpf", "name", "email", "type"]}
                tableData={data}
                setCurrent={handleFormatEdit}
                actions={
                  <>
                    <Tooltip
                      id="tooltip-top"
                      title="Editar"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={handleModalUser}
                      >
                        <Edit
                          className={
                            classes.tableActionButtonIcon +
                            " " +
                            classes.edit
                          }
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      id="tooltip-top-start"
                      title="Excluir"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Remove"
                        className={classes.tableActionButton}
                        onClick={handleOpenDelete}
                      >
                        <Delete
                          className={
                            classes.tableActionButtonIcon + " " + classes.remove
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      
      <DeleteModal
        open={open}
        handleClose={handleCancelDelete}
        handleConfirm={handleConfirmDelete}
        title="Excluir Usuário"
        body={`Tem certeza que deseja excluir o usuário "${values.name}"?`}
      />
    </>
  );
}

UsersList.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(UsersList);
