import React from 'react';
import { formatDate, formatPhoneNumber } from '../../utils/FormatterUtil'

import DataTable from '../../components/dataTable/DataTable'
import CustomerDialog from './CustomerDialog'

import { getCustomers } from '../../services/CustomerService'

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

  async function getCustomersAPI() {
    const response = await getCustomers(5, 0) // TODO
    for (let elem of response.data.rows) {
      if (elem['createdAt'])
        elem['createdAt'] = formatDate(elem['createdAt'])
      if (elem['updatedAt'])
        elem['updatedAt'] = formatDate(elem['updatedAt'])
      if (elem['phone'])
        elem['phone'] = formatPhoneNumber(elem['phone'])
    }
    setCustomers(response.data.rows)
  }

  async function onChangeData() {
    await getCustomersAPI()
  }

  function onEditData(data) {
    setEditCustomer(data)
  }

  function onClearEditData() {
    setEditCustomer(null)
  }

  React.useEffect(() => {
    async function loadCustomers() {
      await getCustomersAPI()
    }
    loadCustomers()
  }, [])

  return (
    <>
      <DataTable title="Clientes" header={headCells} rows={customers} onEditData={onEditData} />
      <CustomerDialog onChange={onChangeData} editData={editCustomer} onClearEditData={onClearEditData} />
    </>
  )
}

export default Customers;