import React from "react";
import PropTypes from "prop-types";

// Utils
import { validateDate, formatDate } from "utils/DateFormat.js";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";

import styles from "./style.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tablecells,
    tableData,
    tableHeaderColor,
    actions,
    setCurrent = () => {},
    showFile = null,
    handleShowFile = () => {},
  } = props;

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage = 0) => {
    if (newPage == 0) {
      const array = tableData.slice(0, rowsPerPage);
      setData(array);
    } else {
      const from = (newPage * rowsPerPage);
      const to = tableData.length < from + rowsPerPage ? tableData.length : from + rowsPerPage;
      setData(tableData.slice(from, to));
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeCurrent = (current) => {
    setCurrent(current);
  };

  const handleOpenUrl = (current) => {
    const { url } = current;
    window.open(url);
  };

  React.useEffect(() => { handleChangePage() }, [tableData, rowsPerPage]);

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                    style={{ width: prop.width }}
                  >
                    {prop.name}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {data.map((data, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {tablecells.map((prop, key) => {
                  return (
                      prop === "url"
                        ? <TableCell className={classes.tableCell} key={key}>
                          <Link underline="always" className={classes.url}
                            onClick={() => handleOpenUrl(data)}
                          >{data[prop]?.substr(8, 51).concat("...") || ""}</Link>
                        </TableCell>
                        : prop === "image"
                          ? <TableCell className={classes.tableCell} key={key}>
                            <Avatar alt="user" src={data.url}/>
                          </TableCell>
                          :<TableCell className={classes.tableCell} key={key}>
                            {validateDate(data[prop]) ? formatDate(data[prop]) : data[prop]}
                          </TableCell>
                  );
                })}
                <TableCell
                  className={classes.tableCell}
                  key={key}
                  onClick={() => handleChangeCurrent(data)}>
                  {
                    showFile && <Tooltip
                      id="tooltip-top"
                      title="Visualizar"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        size="small"
                        aria-label="Visibility"
                        className={classes.tableActionButton}
                        onClick={() => handleShowFile(data)}
                      >
                        {showFile}
                      </IconButton>
                    </Tooltip>
                  }
                  {actions}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage={"Linhas por Página"}
        labelDisplayedRows={({ from, to, count }) => {
          return "" + from + "-" + to + " de " + count;
        }}
        backIconButtonText={"Página Anterior"}
        nextIconButtonText={"Proxíma Página"}
      />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tablecells: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object),
  setCurrent: PropTypes.func,
  actions: PropTypes.any,
  showFile: PropTypes.any,
  handleShowFile: PropTypes.func,
};
