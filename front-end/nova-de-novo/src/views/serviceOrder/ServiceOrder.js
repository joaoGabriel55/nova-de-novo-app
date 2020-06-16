import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Divider } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import brLocale from "date-fns/locale/pt-BR";

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { ServiceOrderModel, ServiceModel } from '../../models/ServiceOrderModel'

function ServiceOrder() {
  const classes = useStyles();

  const [serviceOrder, setServiceOrder] = React.useState(new ServiceOrderModel());
  const [service, setService] = React.useState(new ServiceModel());
  const [services, setServices] = React.useState([]);
  const [entryDate, setEntryDate] = React.useState(new Date())
  const [deliveryDate, setDeliveryDate] = React.useState(new Date())

  const updateServiceField = e => {
    setService({
      ...service,
      [e.target.name]: e.target.value
    })
  }

  const handleEntryDateChange = (date) => {
    setEntryDate(date);
    serviceOrder({
      ...serviceOrder,
      entryDate: date
    })
  };

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
    serviceOrder({
      ...serviceOrder,
      deliveryDate: date
    })
  };

  const onAddService = () => {
    if (service) {
      service.price = parseFloat(service.price)
      const serviceAdd = service
      setServices([...services, serviceAdd])
      setService({
        ...service
      })
    }
  }

  function onRemoveService(indexService) {
    const newServices = services.filter((elem) => services.indexOf(elem) !== indexService);
    console.log(newServices)
    setServices(newServices);
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">
          Gerar nova Ordem de Serviço
        </Typography>
        <div style={{ marginTop: 28 }}>
          <Autocomplete
            id="combo-box-demo"
            size="small"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params}
              color="secondary" label="Informe o cliente" variant="outlined" />}
          />
          <List dense component="nav"
            style={{ marginTop: 28 }}
            subheader={
              <ListSubheader component="div" style={{ marginBottom: 8 }}>
                <Typography variant="body1">
                  <b>Serviços a fazer</b>
                </Typography>
              </ListSubheader>
            }>
            {services.map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <>
                  <ListItem key={value} style={{ paddingTop: 12, paddingBottom: 12 }} button>
                    <ListItemText id={labelId}  >
                      <div style={{
                        display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between', alignItems: 'center',
                        marginRight: 18
                      }}>
                        <div>
                          {value.name}
                        </div>
                        <div style={{ marginRight: 18 }}>
                          R$ {value.price}
                        </div>
                      </div>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => onRemoveService(services.indexOf(value))} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </>
              );
            })}
          </List>
          <div className={classes.inlineFlexRow}>
            <TextField
              color="secondary"
              value={service.name}
              onChange={updateServiceField}
              id="name"
              name="name"
              fullWidth label="Nome do serviço" variant="outlined" size="small" />
            <div style={{ width: 9 }}></div>
            <TextField
              value={service.price}
              onChange={updateServiceField}
              id="price"
              name="price"
              color="secondary" label="Preço" variant="outlined" size="small" />
            <div style={{ width: 9 }}></div>
            <Tooltip title="Adicionar serviço" aria-label="add">
              <IconButton aria-label="add" color='secondary' onClick={() => onAddService()}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <div style={{ width: 9 }}></div>
          </div>
          <br></br>
          <Divider />
          <div className={classes.inlineFlexRow}>
            <div></div>
            <Typography variant="body1">
              <span><b>Total: </b>R$ 49.99</span>
            </Typography>
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
              <InputLabel
                id="demo-simple-select-outlined-label">Período de entrega</InputLabel>
              <Select
                labelId="demo-simple-select"
                id="contract"
                name="contract"
                label="Período de entrega"

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
            getOptionLabel={(option) => option.title}
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
  inlineFlexRow: {
    display: 'flex', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8,
    marginRight: 8
  },
  pos: {
    marginBottom: 12,
  },
}))

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

export default ServiceOrder;
