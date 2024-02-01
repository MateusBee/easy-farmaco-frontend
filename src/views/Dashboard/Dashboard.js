import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';
// Services
import { getAll, updateMedication } from 'services/ministration';
// Utils
import { validateAccess } from "utils/Access";
import { formatDate, formatDateTime } from "utils/DateFormat.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
//import Icon from "@material-ui/core/Icon";

// components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Modal from "components/Modal/Modal.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/Button/Button.js";
import CustomInput from "components/Input/Text.js";
import Timer from "components/Timer/Timer";

// @material-ui/icons
import Update from "@material-ui/icons/Update";
import Search from "@material-ui/icons/Search";

import styles from "./style.js";

const useStyles = makeStyles(styles);

function Dashboard({ enqueueSnackbar }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [defaultData, setDefaultData] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [current, setCurrent] = React.useState(null);

  const getDataTable = () => {
    getAll().then(({data}) => {
      setData([]);
      setDefaultData([]);
      setData(data.data);
      setDefaultData(data.data);
    });
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
    const tableData = data.filter((d) => d.patient.name.toUpperCase().includes(text));
    setData(tableData);
  };

  const handleOpen = (data) => {
    setCurrent(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
  };

  const handleConfirm = () => {

    const data = {
      medicatedAt: new Date()
    }

    updateMedication(current._id, data).then(() => {
      enqueueSnackbar('Medicamentos administrados com sucesso', { variant: 'success' });
      handleClose();
      getDataTable();
    })
    .catch(() => {
      enqueueSnackbar('Oops! Não foi possível confirmar a administração dos medicamentos', { variant: 'error' });
    })

  };

  const getTime = (patient) => {
    const aux = patient.filter((p) => p.ministrated === false);

    return aux[0].targetTime;
  };

  React.useEffect(() => getDataTable(), []);

  const renderMedications = () =>
  <>
    <div className={classes.item}>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <strong className={classes.info}>{current?.medication.name} - {current?.medication.form}</strong>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <strong className={classes.info}>{current?.dose}</strong>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <strong className={classes.info}>{current?.instructions}</strong>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <strong className={classes.info}>{formatDateTime(current? getTime(current.medicatedStory) : null)}</strong>
        </GridItem>
      </GridContainer>
    </div>
  </>

  return (
    <div>
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
      <GridContainer>
        {
          data.map((patient) => (
            <GridItem xs={12} sm={6} md={3} key={patient._id}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon image={patient.patient.url} />
                  <h3 className={classes.cardTitle}>
                    {patient.patient.name}
                  </h3>
                  <p className={classes.cardCategory}>{formatDateTime(getTime(patient.medicatedStory))}</p>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Update />
                    <Timer date={getTime(patient.medicatedStory)} />
                  </div>
                  <Link
                    underline="always"
                    className={classes.link}
                    onClick={() => handleOpen(patient)}
                  >Detalhes</Link>
                </CardFooter>
              </Card>
            </GridItem>
          ))
        }
      </GridContainer>

      <Modal
        open={open}
        handleClose={handleClose}>
        <>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={6}>
              <Card>
                <CardBody className={classes.cardCategory} >
                  <h3 className={classes.cardTitle}>
                    Dados do Paciente {current?.name}
                  </h3>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={4}>
                      Nome:<strong className={classes.info}>{current?.patient.name}</strong>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4}>
                      CPF:<strong className={classes.info}>{current?.patient.cpf}</strong>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4}>
                      Data de Nascimento:<strong className={classes.info}>{formatDate(current?.patient.birth)}</strong>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={4}>
                      Idade:<strong className={classes.info}>{current?.patient.age}</strong>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4}>
                      Peso:<strong className={classes.info}>{current?.patient.weight} Kg</strong>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4}>
                      Altura:<strong className={classes.info}>{current?.patient.height}</strong>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={6} md={4}>
                      Observações:<strong className={classes.info}>{current?.patient.comments}</strong>
                    </GridItem>
                  </GridContainer>
                  <Divider className={classes.divider} />
                  <h3 className={classes.cardTitle}>
                    Medicamentos
                  </h3>
                  <div>
                    <GridContainer>
                      <GridItem xs={12} sm={6} md={3}>
                        Nome
                      </GridItem>
                      <GridItem xs={12} sm={6} md={3}>
                        Dosagem
                      </GridItem>
                      <GridItem xs={12} sm={6} md={3}>
                        Instruções
                      </GridItem>
                      <GridItem xs={12} sm={6} md={3}>
                        Horário
                      </GridItem>
                    </GridContainer>
                  </div>
                  {renderMedications()}
                </CardBody>
                <CardFooter stats>
                  <div/>
                  <div>
                    <Button
                      className={classes.cancel}
                      onClick={handleClose}>Cancelar</Button>
                    {
                      validateAccess([1,2,5]) &&  <Button
                      color="success"
                      onClick={handleConfirm}>Confirmar Administração</Button>
                    }
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </>
      </Modal>
    </div>
  );
}

Dashboard.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

export default withSnackbar(Dashboard);
