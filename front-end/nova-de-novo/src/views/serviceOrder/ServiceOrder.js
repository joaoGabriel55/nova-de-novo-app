import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
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

import { getCustomersLike } from '../../services/CustomerService'
import { getDressmakers } from '../../services/DressmakerService'

export default function ServiceOrder() {
  const classes = useStyles();

  const [serviceOrder, setServiceOrder] = React.useState(new ServiceOrderModel());
  const [service, setService] = React.useState(new ServiceModel());
  const [services, setServices] = React.useState([]);
  const [entryDate, setEntryDate] = React.useState(new Date())
  const [deliveryDate, setDeliveryDate] = React.useState(new Date())

  const [customers, setCustomers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const loading = open && customers.length === 0;

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

    if (!loading) {
      return undefined;
    }

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
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setCustomers([]);
    }
  }, [open]);

  const getSelectedCustomerId = (value) => {
    setServiceOrder({
      ...serviceOrder,
      customerId: value.id
    })
  }

  const handleCustomersSearch = e => {
    const name = e.target.value
    getCustomersLike(10, 0, name)
      .then(res => {
        setCustomers(res.data.rows)
      })
      .catch(() => {
        setCustomers([])
      });
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">
          Gerar nova Ordem de Serviço
        </Typography>
        <div style={{ marginTop: 28 }}>
          <Autocomplete
            id="asynchronous-demo"
            size="small"
            open={open}
            onChange={(event, value) => getSelectedCustomerId(value)}
            noOptionsText="Cliente não encontrado"
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={customers}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Informe o cliente"
                variant="outlined"
                color="secondary"
                onChange={handleCustomersSearch}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {/* <Autocomplete
            id="combo-box-demo"
            size="small"
            options={customers}
            noOptionsText="Cliente não encontrado"
            getOptionLabel={(option) => option.name}
            style={{ width: '100%' }}
            renderInput={
              (params) => <TextField {...params}
                onChange={handleCustomersSearch}
                color="secondary" label="Informe o cliente" variant="outlined"
              />
            }
          /> */}
          <br></br>
          <ServicesList
            service={service} setService={setService}
            services={services} setServices={setServices}
          />
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
          <Autocomplete
            id="combo-box-demo"
            size="small"
            options={top100Films}
            getOptionLabel={(option) => option.name}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params}
              style={{ marginTop: 18, marginBottom: 8 }}
              color="secondary" label="Informe a costureira" variant="outlined" />}
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
  spacing: {
    // flex: '1 1 100%'
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { id: 1, name: 'Ana', year: 1994 },
  { id: 2, name: 'Bruno', year: 1972 },
  { id: 3, name: 'Carlos', year: 1974 }
];
