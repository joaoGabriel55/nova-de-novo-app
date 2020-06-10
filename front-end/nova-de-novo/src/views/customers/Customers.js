import React from 'react';
import { formatDate, formatPhoneNumber } from '../../utils/FormatterUtil'
import { snackbarService } from "uno-material-ui";
import DataTable from '../../components/dataTable/DataTable'
import CustomerDialog from './CustomerDialog'

import { getCustomers, getCustomersLike } from '../../services/CustomerService'

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Nome' },
  { id: 'phone', numeric: true, disablePadding: false, label: 'Telefone' },
  { id: 'email', numeric: true, disablePadding: false, label: 'E-mail' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Endereço' },
  { id: 'addressDescription', numeric: true, disablePadding: false, label: 'Complemento' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Criado em', momentFormat: 'DD/MM/YYYY hh:mm' },
  { id: 'updatedAt', numeric: true, disablePadding: false, label: 'Atualizado em' },
];

function Customers() {
  const [customers, setCustomers] = React.useState([])
  const [editCustomer, setEditCustomer] = React.useState(null)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [countDataCollection, setCountDataCollection] = React.useState(0);
  // const [searchName, set] = React.useState(null)

  async function getCustomersAPI(rowsPerPage, page, name) {
    try {
      let response = null
      if (!name)
        response = await getCustomers(rowsPerPage, page)
      else
        response = await getCustomersLike(rowsPerPage, page, name)

      for (let elem of response.data.rows) {
        if (elem['createdAt'])
          elem['createdAt'] = formatDate(elem['createdAt'])
        if (elem['updatedAt'])
          elem['updatedAt'] = formatDate(elem['updatedAt'])
        if (elem['phone'])
          elem['phone'] = formatPhoneNumber(elem['phone'])
      }

      setCountDataCollection(response.data.count)
      setRowsPerPage(rowsPerPage)
      setPage(page)
      setCustomers(response.data.rows)

    } catch (error) {
      snackbarService.showSnackbar('Problema ao carregar clientes', 'error')
    }
  }

  async function onChangeData() {
    await getCustomersAPI(rowsPerPage, page)
  }

  async function onSearchData(data) {
    if (data.target.value)
      await getCustomersAPI(rowsPerPage, page, data.target.value)
  }

  function onEditData(data) {
    setEditCustomer(data)
  }

  function onClearEditData() {
    setEditCustomer(null)
  }

  React.useEffect(() => {
    async function loadCustomers(rowsPerPage, page) {
      await getCustomersAPI(rowsPerPage, page)
    }
    loadCustomers(rowsPerPage, page)
  }, [rowsPerPage, page, countDataCollection])

  return (
    <>
      <DataTable title="Clientes"
        header={headCells}
        onSearchData={onSearchData}
        rows={customers}
        onEditData={onEditData}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        countDataCollection={countDataCollection}
      />
      <CustomerDialog onChange={onChangeData} editData={editCustomer} onClearEditData={onClearEditData} />
    </>
  )
}

export default Customers;