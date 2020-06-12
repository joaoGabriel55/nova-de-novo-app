import React from 'react';
import { formatDate, formatPhoneNumber } from '../../utils/FormatterUtil'
import { snackbarService } from "uno-material-ui";
import DataTable from '../../components/dataTable/DataTable'
// import DressmakerDialog from './DressmakerDialog'

import { getDressmakers } from '../../services/DressmakerService'

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Nome' },
  { id: 'phone', numeric: true, disablePadding: false, label: 'Telefone' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Endereço' },
  { id: 'contract', numeric: true, disablePadding: false, label: 'Tipo de contrato' },
  { id: 'admission', numeric: true, disablePadding: false, label: 'Data de admissão', momentFormat: 'DD/MM/YYYY' },
];

function Dressmakers() {
  const [dressmakers, setDressmakers] = React.useState([])
  const [editDressmaker, setEditDressmaker] = React.useState(null)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [countDataCollection, setCountDataCollection] = React.useState(0);

  async function getDressmakersAPI(rowsPerPage, page) {
    try {
      const response = await getDressmakers(rowsPerPage, page)

      for (let elem of response.data.rows) {
        if (elem['admission'])
          elem['admission'] = formatDate(elem['admission'])
        if (elem['phone'])
          elem['phone'] = formatPhoneNumber(elem['phone'])
      }

      setCountDataCollection(response.data.count)
      setRowsPerPage(rowsPerPage)
      setPage(page)
      setDressmakers(response.data.rows)

    } catch (error) {
      snackbarService.showSnackbar('Problema ao carregar costureiras', 'error')
    }
  }

  async function onChangeData() {
    await getDressmakersAPI(rowsPerPage, page)
  }

  function onEditData(data) {
    setEditDressmaker(data)
  }

  async function onDeleteData(data) {
    if (data) {
      try {
        for (const customer of data) {
          // await deleteCustomer(customer.id)
        }
        snackbarService.showSnackbar('Costureira(s) removida(s) com sucesso!', 'success')
        await onChangeData()
      } catch (error) {
        snackbarService.showSnackbar('Problema ao remover Costureira(s)', 'error')
      }
    }
  }

  // function onClearEditData() {
  //   setEditDressmaker(null)
  // }

  React.useEffect(() => {
    async function loadDressmakers(rowsPerPage, page) {
      await getDressmakersAPI(rowsPerPage, page)
    }
    loadDressmakers(rowsPerPage, page)
  }, [rowsPerPage, page, countDataCollection])

  return (
    <>
      <DataTable title="Costureiras"
        header={headCells}
        rows={dressmakers}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        countDataCollection={countDataCollection}
        onEditData={onEditData}
        onDeleteData={onDeleteData}
      />
    </>
  )
}

export default Dressmakers;