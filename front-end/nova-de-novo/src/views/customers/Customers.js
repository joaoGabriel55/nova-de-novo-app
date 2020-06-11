import React from 'react';
import { formatDate, formatPhoneNumber } from '../../utils/FormatterUtil'
import { snackbarService } from "uno-material-ui";
import DataTable from '../../components/dataTable/DataTable'
import CustomerDialog from './CustomerDialog'
// import CustomerRemoveDialog from './CustomerRemoveDialog'

import { getCustomers, getCustomersLike, deleteCustomer } from '../../services/CustomerService'

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
  const [searchName, setSearchName] = React.useState(null)
  // const [removableData, setRemovableData] = React.useState(null)

  async function getCustomersAPI(rowsPerPage, page, name) {
    try {
      let response = null
      if (name)
        response = await getCustomersLike(rowsPerPage, page, name)
      else
        response = await getCustomers(rowsPerPage, page)

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

  function onSearchData(data) {
    if (data.target.value)
      setSearchName(data.target.value)
    else
      setSearchName(null)
  }

  function onEditData(data) {
    setEditCustomer(data)
  }

  async function onDeleteData(data) {
    if (data) {
      try {
        for (const customer of data) {
          await deleteCustomer(customer.id)
        }
        snackbarService.showSnackbar('Cliente(s) removido(s) com sucesso!', 'success')
        await onChangeData()
      } catch (error) {
        snackbarService.showSnackbar('Problema ao remover cliente(s)', 'error')
      }
    }
  }

  // async function deleteCustomers() {
  //   if (removableData) {
  //     try {
  //       for (const customer of removableData) {
  //         await deleteCustomer(customer.id)
  //       }
  //       snackbarService.showSnackbar('Cliente(s) removido(s) com sucesso!', 'success')
  //       await onChangeData()
  //     } catch (error) {
  //       snackbarService.showSnackbar('Problema ao remover cliente(s)', 'error')
  //     }
  //   }
  // }

  function onClearEditData() {
    setEditCustomer(null)
  }

  React.useEffect(() => {
    async function loadCustomers(rowsPerPage, page, searchName) {
      await getCustomersAPI(rowsPerPage, page, searchName)
    }
    loadCustomers(rowsPerPage, page, searchName)
  }, [rowsPerPage, page, countDataCollection, searchName])

  return (
    <>
      <DataTable title="Clientes"
        header={headCells}
        onSearchData={onSearchData}
        onDeleteData={onDeleteData}
        rows={customers}
        onEditData={onEditData}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        countDataCollection={countDataCollection}
      />
      <CustomerDialog onChange={onChangeData} editData={editCustomer} onClearEditData={onClearEditData} />
      {/* <CustomerRemoveDialog
        deleteDataList={removableData}
        openDeleteDataDialog={onDeleteDataDialog}
        deleteData={deleteCustomers}
      /> */}
    </>
  )
}

export default Customers;