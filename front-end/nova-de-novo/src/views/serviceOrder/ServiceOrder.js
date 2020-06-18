import React from 'react';
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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { ServiceOrderModel, ServiceModel } from '../../models/ServiceOrderModel'

import ServicesList from './ServicesList'
import ServiceOrderAutocomplete from './components/ServiceOrderAutocomplete'

import { getCustomersLike } from '../../services/CustomerService'
import { getDressmakersLike } from '../../services/DressmakerService'

export default function ServiceOrder() {
  const classes = useStyles();

  const [serviceOrder, setServiceOrder] = React.useState(new ServiceOrderModel());
  const [service, setService] = React.useState(new ServiceModel());
  const [services, setServices] = React.useState([]);
  const [entryDate, setEntryDate] = React.useState(new Date())
  const [deliveryDate, setDeliveryDate] = React.useState(new Date())

  const [customers, setCustomers] = React.useState([]);
  const [dressmakers, setDressmakers] = React.useState([]);

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
      setServiceOrder({
        ...serviceOrder,
        customerId: value.id
      })
    }
  }

  const getSelectedDressmakersId = (value) => {
    if (value) {
      setServiceOrder({
        ...serviceOrder,
        dressmakerId: value.id
      })
    }
  }

  const handleCustomersSearch = e => {
    const name = e.target.value
    if (!name) {
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

  const handleDressmakersSearch = e => {
    const name = e.target.value
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

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">
          Gerar nova Ordem de Serviço
        </Typography>
        <div style={{ marginTop: 28 }}>
          <ServiceOrderAutocomplete
            label={"Informe o nome do cliente"}
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
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 28
          }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
              <KeyboardDatePicker
                autoOk
                style={{ marginRight: 4 }}
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
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={brLocale}>
              <KeyboardDatePicker
                autoOk
                style={{ marginLeft: 4 }}
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
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <FormControl required variant="outlined" size="small" fullWidth className={classes.formControl}>
              <InputLabel>Período de entrega</InputLabel>
              <Select
                id="deliveryPeriod"
                name="deliveryPeriod"
                label="Período de entrega"
                onChange={updateField}
                value={serviceOrder.deliveryPeriod ? serviceOrder.deliveryPeriod : ''}
              >
                <MenuItem value={'T'}>Manhã</MenuItem>
                <MenuItem value={'M'}>Tarde</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br></br>
          <ServiceOrderAutocomplete
            label={"Informe o nome da costureira"}
            noOptionsText={"Costureira não encontrada"}
            handleSearch={handleDressmakersSearch}
            getSelected={getSelectedDressmakersId}
            collectionData={dressmakers}
          />
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.spacing}>
        <Button
          style={{ color: 'white' }} variant="contained" disableElevation color="primary" size="large"
        >Finalizar</Button>
      </CardActions>
    </Card>
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
    marginLeft: theme.spacing(1)
  },
  pos: {
    marginBottom: 12,
  },
}))
