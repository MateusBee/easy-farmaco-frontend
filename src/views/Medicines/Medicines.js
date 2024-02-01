import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

// Utils
import { validateAccess } from "utils/Access";
// Services
import { getAll, createMedication, updateMedication, deleteMedication } from 'services/medication';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import CustomInput from "components/Input/Text.js";
import Button from "components/Button/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import DeleteModal from 'components/Modal/Delete.js';

// @material-ui/icons
import Edit from '@material-ui/icons/Edit';
import Delete from "@material-ui/icons/Delete";
import Search from "@material-ui/icons/Search";

import styles from "./style.js";

const useStyles = makeStyles(styles);

function MedicationList({ enqueueSnackbar }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [control, setControl] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [defaultData, setDefaultData] = React.useState([]);
  const [data, setData] = React.useState([]);
  
  const initialValues = { name: "", form: "", type: "", url: "" };
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (event) => {
    const name = event.target.name;
    setValues({ ...values, [name]: event.target.value});
  };

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

  const handleFormatEdit = (current) => {
    setValues({
      _id: current._id,
      name: current.name,
      form: current.form,
      type: current.type,
      url: current.url ?? "",
    });
  };

  const getDataTable = () => {
    getAll().then(({data}) => {
      setData(data.data);
      setDefaultData(data.data);
    });
  };

  const handleModalMedication = () => {
    setValues(initialValues);
    setControl(true);
  };

  const handleOpenDelete = () => {
    setControl(false);
    setOpen(true);
  };

  const handleCancelMedication = () => {
    setControl(false);
    setValues(initialValues);
  };

  const handleCancelDelete = () => {
    setOpen(false);
  };

  const handleSaveMedication = async e => {
    e.preventDefault();

    const fields = ["name", "form", "type", "url"];
    const formElements = e.target.elements;

    const formValues = fields
      .map(field => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));

    if(values._id) handleUpdateMedication(values._id, formValues);
    else handleCreateMedication(formValues);
  };

  const handleUpdateMedication = (id, data) => {
    updateMedication(id, data).then(() => {
      handleCancelMedication();
      enqueueSnackbar('Medicamento atualizado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível atualizar o medicamento', { variant: 'error' });
    })
  };

  const handleCreateMedication = (data) => {
    createMedication(data).then(() => {
      handleCancelMedication();
      enqueueSnackbar('Medicamento registrado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível cadastrar o medicamento', { variant: 'error' });
    })
  };

  const handleConfirmDelete = () => {
    deleteMedication(values._id).then(() => {
      enqueueSnackbar('Registro excluido com sucesso', { variant: 'success' });
      handleCancelDelete();
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível excluir esse registro', { variant: 'error' });
    })
  };

  React.useEffect(() => getDataTable(), []);

  const FormMedication = () =>
    <GridItem xs={12} sm={12} md={12}
      style={{
        position: control ? "relative" : "absolute",
        visibility: control ? "inherit" : "hidden"
      }}>
      <Card>
        <form onSubmit={handleSaveMedication}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Novo Medicamento</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
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
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Formula*"
                  id="form"
                  inputProps={{
                    required: true,
                    name: "form",
                    value: values.form,
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
                  labelText="Tipo*"
                  id="type"
                  inputProps={{
                    required: true,
                    name: "type",
                    value: values.type,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Link para Bula*"
                  id="url"
                  inputProps={{
                    required: true,
                    name: "url",
                    value: values.url,
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
            <div>
              <Button
                className={classes.cancel}
                color="danger"
                onClick={handleCancelMedication}>Cancelar</Button>
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
        {FormMedication()}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardFooter>
              {
                validateAccess([1,5])
                  ? <Button
                    color="primary"
                    styles={{ marginTop: 10 }}
                    onClick={handleModalMedication}>Novo Medicamento</Button>
                    : <div/>
              }

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
                  { name: "Nome", width: 150 },
                  { name: "Formula", width: 100 },
                  { name: "Tipo", width: 50 },
                  { name: "Link da Bula", width: 200 },
                  { name: "Ações", width: 50 },]}
                tablecells={["name", "form", "type", "url"]}
                tableData={data}
                setCurrent={handleFormatEdit}
                actions={
                  <>
                  {
                    validateAccess([1,5]) && <Tooltip
                      id="tooltip-top"
                      title="Editar"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={handleModalMedication}
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
                  }
                  {
                    validateAccess([1,5]) && <Tooltip
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
                            classes.tableActionButtonIcon +
                            " " +
                            classes.remove
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  }
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
        title="Excluir Medicamento"
        body={`Tem certeza que deseja excluir o medicamento "${values.name}" do sistema?`}
      />
    </>
  );
}

MedicationList.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(MedicationList);
