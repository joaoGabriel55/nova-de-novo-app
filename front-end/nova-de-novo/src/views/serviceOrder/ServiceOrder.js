import React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { snackbarService } from "uno-material-ui";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import brLocale from "date-fns/locale/pt-BR";

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { ServiceOrderModel, ServiceModel, serviceOrderModelParser } from '../../models/ServiceOrderModel'
import { CustomerModel } from '../../models/CustomerModel'
import { DressmakerModel } from '../../models/DressmakerModel'

import ServicesList from './ServicesList'
import ServiceOrderAutocomplete from './components/ServiceOrderAutocomplete'

import { createServiceOrder, updateServiceOrder, getServiceOrderById } from '../../services/ServiceOrderService'
import { getCustomersLike, getCustomerById } from '../../services/CustomerService'
import { getDressmakersLike, getDressmakerById } from '../../services/DressmakerService'

export default function ServiceOrder() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [serviceOrder, setServiceOrder] = React.useState(new ServiceOrderModel());
  const [service, setService] = React.useState(new ServiceModel());
  const [services, setServices] = React.useState([]);
  const [entryDate, setEntryDate] = React.useState(new Date())
  const [deliveryDate, setDeliveryDate] = React.useState(new Date())

  const [customers, setCustomers] = React.useState([]);
  const [customer, setCustomer] = React.useState(new CustomerModel());
  const [dressmakers, setDressmakers] = React.useState([]);
  const [dressmaker, setDressmaker] = React.useState(new DressmakerModel());

  const updateField = e => {
    setServiceOrder({
      ...serviceOrder,
      [e.target.name]: e.target.value
    })
  }

  const handleEntryDateChange = (date) => {
    setEntryDate(date);
    setServiceOrder({
      ...serviceOrder,
      entryDate: date
    })
  };

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
    setServiceOrder({
      ...serviceOrder,
      deliveryDate: date
    })
  };

  React.useEffect(() => {
    if (id) {
      let active = true;
      (async () => {
        if (active) {
          try {
            let response = await getServiceOrderById(id)
            const serviceOrderFound = serviceOrderModelParser(response.data)

            setServiceOrder(serviceOrderFound)
            setEntryDate(serviceOrderFound.entryDate)
            setDeliveryDate(serviceOrderFound.deliveryDate)
            setServices(serviceOrderFound.services)

            response = await getCustomerById(serviceOrderFound.customerId)
            setCustomer(response.data)

            response = await getDressmakerById(serviceOrderFound.dressmakerId)
            setDressmaker(response.data)

            return serviceOrderFound
          } catch (error) {
            snackbarService.showSnackbar(`Ordem de Serviço num. ${id} não encontrada`, 'info')
            history.replace('/ordem-de-servico')
          }
        }
      })();
      return () => {
        active = false;
      };
    }
  }, [id, history])

  React.useEffect(() => {
    let active = true;

    (async () => {
      const response = await getCustomersLike(10, 0, '')
      const data = response.data.rows
      if (active) {
        setCustomers(data)
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    let active = true;

    (async () => {
      const response = await getDressmakersLike(10, 0, '')
      const data = response.data.rows
      if (active) {
        setDressmakers(data)
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const getSelectedCustomerId = (value) => {
    if (value) {
      setCustomer(value)
      setServiceOrder({
        ...serviceOrder,
        customerId: value.id
      })
    }
  }

  const getSelectedDressmakersId = (value) => {
    if (value) {
      setDressmaker(value)
      setServiceOrder({
        ...serviceOrder,
        dressmakerId: value.id
      })
      console.log(serviceOrder)
    }
  }

  const handleCustomersSearch = name => {
    if (!name) {
      setCustomer(new CustomerModel())
      setServiceOrder({
        ...serviceOrder,
        customerId: undefined
      })
    }
    getCustomersLike(10, 0, name)
      .then(res => {
        setCustomers(res.data.rows)
      })
      .catch(() => {
        setCustomers([])
      });
  }

  const handleDressmakersSearch = name => {
    if (!name) {
      setServiceOrder({
        ...serviceOrder,
        dressmakerId: undefined
      })
    }
    getDressmakersLike(10, 0, name)
      .then(res => {
        setDressmakers(res.data.rows)
      })
      .catch(() => {
        setDressmakers([])
      });
  }

  const getTotalPrice = () => {
    if (serviceOrder.totalPrice > 0)
      return serviceOrder.totalPrice
  }

  const handleRadioServiceStatusChange = (event) => {
    let value = event.target.value
    if (value) {
      setServiceOrder({
        ...serviceOrder,
        statusService: value
      })
    }
  }

  const handleRadioPaymentStatusChange = (event) => {
    let value = (event.target.value === 'true')
    setServiceOrder({
      ...serviceOrder,
      statusPayment: value
    })
  };

  async function saveOrUpdateServiceOrder(e) {
    e.preventDefault()
    let isEdit = id && serviceOrder.id
    try {
      if (services.length === 0) {
        snackbarService.showSnackbar('Adicione ao menos um serviço.', 'info')
        return;
      }
      serviceOrder.services = services
      console.log(serviceOrder)
      if (isEdit)
        await updateServiceOrder(id, serviceOrder)
      else
        await createServiceOrder(serviceOrder)
      console.log(serviceOrder)
      snackbarService.showSnackbar(`Ordem de Serviço ${isEdit ? 'atualizada' : 'gerada'} com sucesso!`, 'success')
    } catch (error) {
      snackbarService.showSnackbar(`Problema ao ${isEdit ? 'atualizar' : 'gerar'} Ordem de Serviço`, 'error')
    }
  }

  return (
    <Card className={classes.root}>
      <form onSubmit={saveOrUpdateServiceOrder}>
        <CardContent>
          <Typography variant="h6">
            Gerar nova Ordem de Serviço
          </Typography>
          <div style={{ marginTop: 28 }} >
            <ServiceOrderAutocomplete
              label={"Informe o nome do cliente"}
              valueProp={customer}
              noOptionsText={"Cliente não encontrado"}
              handleSearch={handleCustomersSearch}
              getSelected={getSelectedCustomerId}
              collectionData={customers}
            />
            <br></br>
            <ServicesList
              service={service} setService={setService}
              services={services} setServices={setServices}
              serviceOrder={serviceOrder} setServiceOrder={setServiceOrder}
            />
            <div className={classes.inlineFlexRow}>
              <div></div>
              {
                getTotalPrice() ?
                  <Typography variant="body1" style={{ marginRight: 20 }}>
                    <span><b>Total: </b>R$ {getTotalPrice()}</span>
                  </Typography> :
                  null
              }
            </div>
            <div className={classes.deliveryForm}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
                <KeyboardDatePicker
                  autoOk
                  className={classes.deliveryFormField}
                  disableToolbar
                  color="secondary"
                  fullWidth
                  variant="inline"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="entryDate"
                  name="entryDate"
                  label="Data de entrada"
                  invalidDateMessage="Formato da data inválido"
                  size="small"
                  value={entryDate}
                  onChange={handleEntryDateChange}
                  required
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
                <KeyboardDatePicker
                  autoOk
                  disableToolbar
                  color="secondary"
                  fullWidth
                  variant="inline"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="deliveryDate"
                  name="deliveryDate"
                  label="Data de entrega"
                  invalidDateMessage="Formato da data inválido"
                  size="small"
                  value={deliveryDate}
                  onChange={handleDeliveryDateChange}
                  required
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <FormControl required variant="outlined" size="small" fullWidth className={classes.formControl}>
                <InputLabel color="secondary">Período de entrega</InputLabel>
                <Select
                  id="deliveryPeriod"
                  name="deliveryPeriod"
                  label="Período de entrega"
                  color="secondary"
                  onChange={updateField}
                  required
                  value={serviceOrder.deliveryPeriod}
                >
                  <MenuItem value={'M'}>Manhã</MenuItem>
                  <MenuItem value={'T'}>Tarde</MenuItem>
                </Select>
              </FormControl>
            </div>
            <br></br>
            <ServiceOrderAutocomplete
              label={"Informe o nome da costureira"}
              valueProp={dressmaker}
              noOptionsText={"Costureira não encontrada"}
              handleSearch={handleDressmakersSearch}
              getSelected={getSelectedDressmakersId}
              collectionData={dressmakers}
            />
          </div>
          <FormControl style={{ marginTop: 28 }} component="fieldset" color="secondary">
            <FormLabel component="legend">Situação do serviço</FormLabel>
            <RadioGroup
              row aria-label="status-service"
              value={serviceOrder.statusService}
              defaultValue="PENDING"
              onChange={handleRadioServiceStatusChange}
              name="status-service">
              <FormControlLabel
                value="PENDING"
                disabled={id ? false : true}
                control={<Radio color="secondary" />}
                label="Pendente"
              />
              <FormControlLabel
                value="FINISHED"
                disabled={id ? false : true}
                control={<Radio color="secondary" />}
                label="Finalizado"
              />
            </RadioGroup>
          </FormControl>
          <br />
          <FormControl style={{ marginTop: 18 }} component="fieldset" color="secondary">
            <FormLabel component="legend">Situação de pagamento</FormLabel>
            <RadioGroup
              row aria-label="status-payment"
              value={serviceOrder.statusPayment}
              defaultValue={serviceOrder.statusPayment}
              onChange={handleRadioPaymentStatusChange}
              name="status-payment">
              <FormControlLabel
                value={false}
                disabled={id ? false : true}
                control={<Radio color="secondary" />}
                label="Não pago"
              />
              <FormControlLabel
                value={true}
                disabled={id ? false : true}
                control={<Radio color="secondary" />}
                label="Pago"
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
        <Divider />
        <CardActions className={classes.spacing}>
          <Button
            style={{ color: 'white' }}
            type="submit"
            variant="contained"
            disableElevation
            color="primary"
            size="large"
          >{id ? 'Atualizar' : 'Finalizar'}</Button>
        </CardActions>
      </form>
    </Card >
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 4,
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  deliveryForm: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 28,
    ['@media (max-width:780px)']: {
      display: 'flex', flexDirection: 'column'
    },
  },
  deliveryFormField: {
    marginRight: 8
  },
  inlineFlexRow: {
    display: 'flex', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8,
    marginRight: 8
  },
  spacing: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: 8
  },
  formControl: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    ['@media (max-width:780px)']: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(0)
    },
  },
  pos: {
    marginBottom: 12,
  },
}))
