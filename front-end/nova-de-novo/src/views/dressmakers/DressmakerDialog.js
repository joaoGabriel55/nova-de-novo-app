import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { snackbarService } from "uno-material-ui";
import { removeMaskPhoneNumber } from '../../utils/FormatterUtil'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Add } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import InputMask from "react-input-mask";
import { Divider } from '@material-ui/core';

import theme from '../../theme'

import { CustomerModel } from '../../models/CustomerModel'

import { createCustomer, updateCustomer } from '../../services/CustomerService'

export default function CustomerDialog(props) {
    const { onChange, editData, onClearEditData } = props

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const [customer, setCustomer] = React.useState(new CustomerModel())

    const updateField = e => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        })
    }

    React.useEffect(() => {
        if (editData) {
            handleClickOpen(editData)
        }
    })

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            customer.phone = removeMaskPhoneNumber(customer.phone)

            const customerId = customer.id;
            if (!customerId)
                await createCustomer(customer)
            else
                await updateCustomer(customerId, customer)

            const message = `Cliente ${customer.name} ${customerId ? 'atualizado' : 'cadastrado'} com sucesso!`

            setCustomer(new CustomerModel())
            setOpen(false)
            snackbarService.showSnackbar(message, 'success')
            await onChange()
        }
        catch (err) {
            console.log(err)
            snackbarService.showSnackbar('Erro ao cadastrar o cliente', 'error')
        }
    }

    const handleClickOpen = (editData) => {
        if (editData) {
            setCustomer(editData)
            onClearEditData()
        }
        setOpen(true);
    };

    const handleClose = () => {
        setCustomer(new CustomerModel())
        setOpen(false);
    };

    return (
        <div>
            <Fab variant="extended" color="secondary" className={classes.fab} onClick={handleClickOpen}>
                <Add className={classes.extendedIcon} />
                Cadastrar cliente
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">
                    <div style={{ color: theme.palette.secondary.main }}>
                        {`${customer.id ? 'Atualizar' : 'Cadastrar novo'} cliente`}</div>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            id="name"
                            required
                            variant="outlined"
                            autoFocus
                            margin="normal"
                            label="Nome"
                            color="secondary"
                            name="name"
                            value={customer.name}
                            onChange={updateField}
                            fullWidth
                        />
                        <TextField
                            required
                            variant="outlined"
                            margin="normal"
                            id="email"
                            label="Email"
                            type="email"
                            color="secondary"
                            name="email"
                            value={customer.email}
                            onChange={updateField}
                            fullWidth
                        />
                        <InputMask
                            mask="(99) 99999-9999"
                            id="phone"
                            maskChar=" "
                            name="phone"
                            value={customer.phone}
                            onChange={updateField}
                        >
                            {() => <TextField
                                required
                                name="phone"
                                variant="outlined"
                                margin="normal"
                                label="Telefone"
                                color="secondary"
                                fullWidth
                            />}
                        </InputMask>
                        <TextField
                            required
                            variant="outlined"
                            margin="normal"
                            id="address"
                            label="Endereço"
                            color="secondary"
                            name="address"
                            value={customer.address}
                            onChange={updateField}
                            fullWidth
                        />
                        <TextField
                            id="addressDescription"
                            variant="outlined"
                            margin="normal"
                            label="Complemento"
                            color="secondary"
                            name="addressDescription"
                            value={customer.addressDescription}
                            onChange={updateField}
                            fullWidth
                        />
                    </DialogContent>
                    <br></br>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancelar
                    </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ color: 'white' }}
                            disableElevation>
                            {`${customer.id ? 'Atualizar' : 'Cadastrar'}`}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(2),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));
