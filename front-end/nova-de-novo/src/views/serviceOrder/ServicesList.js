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
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="R$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default function ServicesList({
    services,
    setServices,
    service,
    setService,
    serviceOrder,
    setServiceOrder
}) {
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
            setServiceOrder({
                ...serviceOrder,
                totalPrice: serviceOrder.totalPrice += service.price
            })
        }
    }

    function onRemoveService(indexService, service) {
        setServiceOrder({
            ...serviceOrder,
            totalPrice: serviceOrder.totalPrice -= service.price
        })
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
                    fullWidth
                    label="Nome do serviço"
                    variant="outlined"
                    size="small"
                />
                <div style={{ width: 9 }}></div>
                <TextField
                    value={service.price}
                    onChange={updateServiceField}
                    id="service-price"
                    name="price"
                    color="secondary"
                    label="Preço"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                    }}
                />
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
                            {services.length > 0 ? <b>Serviços a fazer</b> : <b>Nenhum serviço adicionado</b>}
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
                                    <IconButton onClick={() => onRemoveService(services.indexOf(value), value)} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </>
                    );
                })}
            </List>
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