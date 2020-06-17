import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';


export default function ServicesList({ services, setServices, service, setService }) {
    const classes = useStyles();

    const updateServiceField = e => {
        const updatedService = service
        setService({
            ...updatedService,
            [e.target.name]: e.target.value
        })
    }

    const onAddService = () => {
        if (service) {
            service.price = parseFloat(service.price)
            const serviceAdd = service
            setServices([...services, serviceAdd])
        }
    }

    const getTotalPrice = () => {
        if (services.length) {
            return services.map((elem) => elem.price)
                .reduce((accumulator, currentValue) => accumulator + currentValue)
        }
    }

    function onRemoveService(indexService) {
        const newServices = services.filter((_, index) => index !== indexService);
        setServices(newServices);
    }

    return (
        <>
            <div className={classes.inlineFlexRow}>
                <TextField
                    color="secondary"
                    value={service.name}
                    onChange={updateServiceField}
                    id="service-name"
                    name="name"
                    fullWidth label="Nome do serviço" variant="outlined" size="small" />
                <div style={{ width: 9 }}></div>
                <TextField
                    value={service.price}
                    onChange={updateServiceField}
                    id="service-price"
                    name="price"
                    color="secondary" label="Preço" variant="outlined" size="small" />
                <div style={{ width: 9 }}></div>
                <Tooltip title="Adicionar serviço" aria-label="add">
                    <IconButton aria-label="add" color='secondary' onClick={() => onAddService()}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <List dense component="nav"
                style={{ marginTop: 28 }}
                subheader={
                    <ListSubheader component="div" style={{ marginBottom: 8 }}>
                        <Typography variant="body1">
                            {getTotalPrice() ? <b>Serviços a fazer</b> : <b>Nenhum serviço adicionado</b>}
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
                <div></div>
                {
                    getTotalPrice() ?
                        <Typography variant="body1" style={{ marginRight: 20 }}>
                            <span><b>Total: </b>R$ {getTotalPrice()}</span>
                        </Typography> :
                        null
                }
            </div>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    inlineFlexRow: {
        display: 'flex', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        marginTop: 8,
        marginRight: 8
    }
}))