import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

// Utils
import { validateAccess } from "utils/Access";
import { formatDate } from "utils/DateFormat";
// Services
import {
  getAll,
  //getMedications,
  createPatient,
  updatePatient,
  deletePatient,
} from 'services/patient';
import { uploadFile } from "services/file";
import { createMedication } from "services/ministration";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
//import Autocomplete from '@material-ui/lab/Autocomplete';
//import TextField from '@material-ui/core/TextField';
//import InputAdornment from '@material-ui/core/InputAdornment';
//import Avatar from "@material-ui/core/Avatar";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/Input/Text.js";
import InputDate from "components/Date/Date.js";
import Button from "components/Button/Button.js";
import DeleteModal from 'components/Modal/Delete.js';

// @material-ui/icons
import Edit from '@material-ui/icons/Edit';
import Delete from "@material-ui/icons/Delete";
import Search from "@material-ui/icons/Search";
//import Save from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
// @font-awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

import styles from "./style.js";

const useStyles = makeStyles(styles);

function PatientsList({ enqueueSnackbar }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [control, setControl] = React.useState(false);
  const [controlMedicines, setControlMedicines] = React.useState(false)

  const [selectedFile, setSelectedFile] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [defaultData, setDefaultData] = React.useState([]);
  const [data, setData] = React.useState([]);
  //const [options, setOptions] = React.useState([]);

  const initialValues = {
    name: "",
    birth: null,
    url: "",
    cpf: "",
    age: "",
    weight: "",
    height: "",
    phone: "",
    comments: "",
  };

  const initialAddress = {
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    number: "",
    complement: "",
  };

  const initialMedication = {
    medication: "",
    dose: "",
    instructions: "",
    interval: "",
    medicationFor: null,
  };

  const [values, setValues] = React.useState(initialValues);
  const [address, setAddress] = React.useState(initialAddress);
  const [medication, setMedication] = React.useState(initialMedication);
  const [medications, setMedications] = React.useState([]);

  const getDataTable = () => {
    getAll().then(({data}) => {
      setData(data.data);
      setDefaultData(data.data);
    });
  };

  //const getDataAutocomplete = () => {
  //  getMedications().then(({data}) => {
  //    setOptions(data.data);
  //  });
  //};

  const handleClean = () => {
    setValues(initialValues);
    setAddress(initialAddress);
    setMedication(initialMedication);
    setMedications([]);
    document.getElementById("file").value = "";
  }

  const handleChange = (event) => {
    const name = event.target.name;
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeImage = (event) => {
    setSelectedFile(true);
    setValues({ ...values, url: event.target.files[0] });
  };

  const handleChangeDate = (date) => {
    setValues({ ...values, birth: date});
  };

  const handleChangeDateMedication = (date) => {
    setMedication({ ...medication, medicationFor: date});
  };

  const handleChangeAddress = (event) => {
    const name = event.target.name;
    setAddress({ ...address, [name]: event.target.value });
  };

  const handleChangeMedication = (event) => {
    const name = event.target.name;
    setMedication({ ...medication, [name]: event.target.value });
  };

//  const handleChangeAutoComplete = (event, newInputValue) => {
//    setMedication({ ...medication, medication: newInputValue });
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

  const handleModalPatient = () => {
    setValues(initialValues);
    setControl(true);
  };

  const handleModalMedicines = () => {
    setValues(initialValues);
    setControlMedicines(true);
  };

  const handleOpenDelete = () => {
    setControl(false);
    setControlMedicines(false);
    setOpen(true);
  };

  const handleCancelPatient = () => {
    setControl(false);
    handleClean();
  };

  const handleCancelMedicines = () => {
    setControlMedicines(false);
    handleClean();
  };

  const handleCancelDelete = () => {
    setOpen(false);
  };

  const handleFormatEdit = (current) => {
    setValues({
      _id: current._id,
      name: current.name,
      url: current.url,
      birth: current.birth,
      cpf: current.cpf,
      age: current.age,
      weight: current.weight,
      height: current.height,
      phone: current.phone,
      comments: current.comments
    });
    setAddress(current.address);
    const medication = current.medication;
    setMedications(medication ? medications.concat([medication]) : []);
  };

  const hadleFormatMedication = (array) => array.map((med) => ({
      patient: values._id,
      medication: med.medication._id,
      interval: med.interval,
      dose: med.dose,
      instructions: med.instructions,
      medicatedAt: new Date(),
      medicationFor: med.medicationFor,
    }))

  const handleFields = (fields, formElements) => fields
  .map(field => ({
    [field]: formElements.namedItem(field).value
  }))
  .reduce((current, next) => ({ ...current, ...next }));

  const handleAddMedication = () => {
    console.log(medication)
    setMedications([ ...medications, medication ]);
    setMedication(initialMedication);
  };

  const handleRemoveMedication = (med) => {
    const data = medications.filter((m) => m.medication._id !== med.medication._id);
    setMedications(data);
  };

  const handleSavePatient = async e => {
    e.preventDefault();
    let image = values.url;

    const fields = [
      "name", "cpf", "age",
      "weight", "height", "phone", "comments"
    ];
    const fieldsAddress = [
      "cep", "street", "neighborhood",
      "city", "number", "complement"
    ];

    const formElements = e.target.elements;

    const formValues = handleFields(fields, formElements);
    const formAddress = handleFields(fieldsAddress, formElements);

    if (selectedFile && values.url) {
      await uploadFile(values.url).then((data) => {
        const { url } = data;
        image = url;
      });
    }

    const data = {
      ...formValues,
      birth: values.birth,
      url: image,
      address: address._id ? { _id: address._id, ...formAddress } : formAddress,
    };

    if(values._id) handleUpdatePatient(values._id, data);
    else handleCreatePatient(data);
  };

  const handleUpdatePatient = (id, data) => {
    updatePatient(id, data).then(() => {
      handleCancelPatient();
      setSelectedFile(false);
      enqueueSnackbar('Paciente atualizado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível atualizar o paciente', { variant: 'error' });
    })
  };

  const handleCreatePatient = (data) => {
    createPatient(data).then(() => {
      handleCancelPatient();
      setSelectedFile(false);
      enqueueSnackbar('Paciente registrado com sucesso', { variant: 'success' });
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível cadastrar o paciente', { variant: 'error' });
    })
  };

  const handleSaveMedicines = () => {
    const formValues = hadleFormatMedication(medications);

    formValues.map((data) => {
      createMedication(data).then(() => {
        enqueueSnackbar('Medicamentos vinculados ao paciente com sucesso', { variant: 'success' });
        handleCancelMedicines();
        handleClean();
      })
      .catch(() => {
        enqueueSnackbar('Oops! Não foi possível vincular os medicamentos ao paciente', { variant: 'error' });
      })

    });

    console.log(formValues);
  };

  const handleConfirmDelete = () => {
    deletePatient(values._id).then(() => {
      enqueueSnackbar('Registro excluido com sucesso', { variant: 'success' });
      handleCancelDelete();
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível excluir esse registro', { variant: 'error' });
    })
  };

  const renderMedications = () =>
    <>
      {
        medications.map((med, index) =>
          <div key={index} className={classes.item}>
            <GridContainer>
              <GridItem xs={12} sm={6} md={3}>
                <strong className={classes.info}>{med.medication.name} - {med.medication.form}</strong>
              </GridItem>
              <GridItem xs={12} sm={6} md={2}>
                <strong className={classes.info}>{med.dose}</strong>
              </GridItem>
              <GridItem xs={12} sm={6} md={3}>
                <strong className={classes.info}>{med.instructions}</strong>
              </GridItem>
              <GridItem xs={12} sm={6} md={1}>
                <strong className={classes.info}>{med.interval} h</strong>
              </GridItem>
              <GridItem xs={12} sm={6} md={2}>
                <strong className={classes.info}>{formatDate(med.medicationFor)} h</strong>
              </GridItem>
              <GridItem xs={12} sm={6} md={1}>
                <Tooltip
                  id="tooltip-top-start"
                  title="Remover"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    size="small"
                    aria-label="Remove"
                    className={classes.tableActionButton}
                    onClick={() => handleRemoveMedication(med)}
                  >
                    <Delete
                      className={
                        classes.tableActionButtonIcon + " " + classes.remove
                      }
                    />
                  </IconButton>
                </Tooltip>
              </GridItem>
            </GridContainer>
          </div>
        )
      }
    </>

  const FormPatients = () =>
    <GridItem xs={12} sm={12} md={12}
      style={{
        position: control ? "relative" : "absolute",
        visibility: control ? "inherit" : "hidden"
      }}>
      <Card>
        <form onSubmit={handleSavePatient}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Novo Paciente</h4>
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
                  labelText="CPF*"
                  id="cpf"
                  inputProps={{
                    required: true,
                    name: "cpf",
                    //type: "number",
                    value: values.cpf,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  id="file"
                  labelText="Imagem"
                  inputProps={{
                    name: "file",
                    type: "file",
                    onChange: handleChangeImage,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  labelProps={{
                    shrink: true,
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <InputDate
                  required={true}
                  id="birthData"
                  name="birthData"
                  label="Data de Nascimento"
                  value={values.birth}
                  onChange={handleChangeDate}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Idade*"
                  id="age"
                  inputProps={{
                    required: true,
                    name: "age",
                    type: "number",
                    value: values.age,
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
                  labelText="Peso*"
                  id="weight"
                  inputProps={{
                    required: true,
                    name: "weight",
                    type: "number",
                    value: values.weight,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Altura*"
                  id="height"
                  inputProps={{
                    required: true,
                    name: "height",
                    value: values.height,
                    onChange: handleChange,
                  }}
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText="Telefone Celular do Responsável*"
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
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Observações"
                  id="comments"
                  inputProps={{
                    name: "comments",
                    multiline: true,
                    rows: 2,
                    value: values.comments,
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
            <div>
              <Button
                className={classes.cancel}
                color="danger"
                onClick={handleCancelPatient}>Cancelar</Button>
              <Button
                color="primary"
                type="submit">Salvar</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </GridItem>

  const FormMedicines = () =>
    <GridItem xs={12} sm={12} md={12}
      style={{
        position: controlMedicines ? "relative" : "absolute",
        visibility: controlMedicines ? "inherit" : "hidden"
      }}>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Paciente {values.name}</h4>
          <p className={classes.cardCategoryWhite}>Vincule os medicamentos que devem ser adiministrados.</p>
        </CardHeader>
        <CardBody className={classes.text}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
              Nome:<strong className={classes.info}>{values.name}</strong>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              Idade:<strong className={classes.info}>{values.age}</strong>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              Peso:<strong className={classes.info}>{values.weight} Kg</strong>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              Altura:<strong className={classes.info}>{values.height}</strong>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={6} md={12}>
              Observações:<strong className={classes.info}>{values.comments}</strong>
            </GridItem>
          </GridContainer>
          <Divider className={classes.divider} />
          {renderMedications()}
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              {/*<Autocomplete
                fullWidth
                id="medicine"
                name="medicine"
                className={classes.formControl}
                options={options}
                //value={medication.medication}
                //defaultValue={patients}
                onChange={handleChangeAutoComplete}
                getOptionLabel={(option) => `${option.name} - ${option.form} - ${option.type}`}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medicamento"
                    name="medicine"
                    classes={{
                      root: classes.root,
                    }}
                  />
                )}
              />*/}
                  </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <CustomInput
                labelText="Dosagem"
                id="dose"
                inputProps={{
                  name: "dose",
                  value: medication.dose,
                  onChange: handleChangeMedication,
                }}
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <CustomInput
                labelText="Instruções"
                id="instructions"
                inputProps={{
                  name: "instructions",
                  value: medication.instructions,
                  onChange: handleChangeMedication,
                }}
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={1}>
              <CustomInput
                labelText="Intervalo hh"
                id="interval"
                inputProps={{
                  name: "interval",
                  value: medication.interval,
                  onChange: handleChangeMedication,
                }}
                formControlProps={{
                  fullWidth: true,
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <InputDate
                required={true}
                id="medicationFor"
                name="medicationFor"
                label="Fim do tratamento"
                value={medication.medicationFor}
                onChange={handleChangeDateMedication}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={1}>
              <Tooltip
                id="tooltip-top"
                title="Vincular"
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton
                  size="small"
                  aria-label="Edit"
                  className={classes.tableActionButton}
                  onClick={handleAddMedication}
                >
                  <AddIcon
                    className={
                      classes.tableActionButtonIcon +
                      " " +
                      classes.medicines
                    }
                  />
                </IconButton>
              </Tooltip>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <div/>
          <div>
            <Button
              className={classes.cancel}
              color="danger"
              onClick={handleCancelMedicines}>Cancelar</Button>
            <Button
              color="primary"
              onClick={handleSaveMedicines}>Salvar</Button>
          </div>
        </CardFooter>
      </Card>
    </GridItem>

  React.useEffect(() => getDataTable(), []);

  //React.useEffect(() => getDataAutocomplete(), []);

  return (
    <>
      <GridContainer>
        {FormPatients()}
        {FormMedicines()}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardFooter>
              {
                validateAccess([4,5])
                  ? <Button
                    color="primary"
                    disabled={control || controlMedicines}
                    styles={{ marginTop: 10 }}
                    onClick={handleModalPatient}>Novo Paciente</Button>
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
                  { name: "", width: 30 },
                  { name: "Nome", width: 150 },
                  { name: "Data de Nascimento", width: 100 },
                  { name: "Idade", width: 50 },
                  { name: "Peso Kg", width: 50 },
                  { name: "Observação", width: 150 },
                  { name: "Ações", width: 50 },]}
                tablecells={["image", "name", "birth", "age", "weight", "comments"]}
                tableData={data}
                setCurrent={handleFormatEdit}
                actions={
                  <>
                  {
                    validateAccess([4,5]) && <Tooltip
                      id="tooltip-top"
                      title="Editar"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={handleModalPatient}
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
                      title="Medicamentos"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Medicines"
                        className={classes.tableActionButton}
                        onClick={handleModalMedicines}
                      >
                        <FontAwesomeIcon
                          className={
                            classes.tableActionButtonIcon + " " + classes.medicines
                          }
                          icon={faUserMd}
                        />
                      </IconButton>
                    </Tooltip>
                  }
                  {
                    validateAccess([4,5]) && <Tooltip
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
        title="Excluir Paciente"
        body={`Tem certeza que deseja excluir o paciente "${values.name}"?`}
      />
    </>
  );
}

PatientsList.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(PatientsList);
