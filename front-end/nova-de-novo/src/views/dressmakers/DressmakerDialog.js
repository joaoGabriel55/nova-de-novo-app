import React from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import brLocale from "date-fns/locale/pt-BR";

import { makeStyles } from '@material-ui/core/styles';
import { snackbarService } from "uno-material-ui";
import { removeMaskPhoneNumber, stringToDate } from '../../utils/FormatterUtil'
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
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import theme from '../../theme'

import { DressmakerModel } from '../../models/DressmakerModel'

import { createDressmaker, updateDressmaker } from '../../services/DressmakerService'

export default function DressmakerDialog(props) {
    const { onChange, editData, onClearEditData } = props

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const [dressmaker, setDressmaker] = React.useState(new DressmakerModel())
    const [dressmakerAdmission, setDressmakerAdmission] = React.useState(new Date())

    const updateField = e => {
        setDressmaker({
            ...dressmaker,
            [e.target.name]: e.target.value
        })
    }

    const handleDateChange = (date) => {
        setDressmakerAdmission(date);
        setDressmaker({
            ...dressmaker,
            admission: date
        })
    };

    React.useEffect(() => {
        if (editData) {
            handleClickOpen(editData)
        }
    })

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            dressmaker.phone = removeMaskPhoneNumber(dressmaker.phone)

            const dressmakerId = dressmaker.id;
            if (!dressmakerId)
                await createDressmaker(dressmaker)
            else
                await updateDressmaker(dressmakerId, dressmaker)

            const message = `Costureira ${dressmaker.name} ${dressmakerId ? 'atualizado' : 'cadastrado'} com sucesso!`

            setDressmaker(new DressmakerModel())
            setOpen(false)
            snackbarService.showSnackbar(message, 'success')
            await onChange()
        }
        catch (err) {
            console.log(err)
            snackbarService.showSnackbar('Erro ao cadastrar o costureira', 'error')
        }
    }

    const handleClickOpen = (editData) => {
        if (editData.id) {
            setDressmakerAdmission(stringToDate(editData.admission))
            setDressmaker(editData)
            onClearEditData()
        }
        setOpen(true);
    };

    const handleClose = () => {
        setDressmaker(new DressmakerModel())
        setOpen(false);
    };

    return (
        <div>
            <Fab variant="extended" color="secondary" className={classes.fab} onClick={handleClickOpen}>
                <Add className={classes.extendedIcon} />
                Cadastrar costureira
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
                fullWidth={true}>
                <DialogTitle id="form-dialog-title">
                    <div style={{ color: theme.palette.secondary.main }}>
                        {`${dressmaker.id ? 'Atualizar' : 'Cadastrar nova'} costureira`}
                    </div>
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
                            value={dressmaker.name}
                            onChange={updateField}
                            fullWidth
                        />
                        <InputMask
                            mask="(99) 99999-9999"
                            id="phone"
                            maskChar=" "
                            name="phone"
                            value={dressmaker.phone}
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
                            value={dressmaker.address}
                            onChange={updateField}
                            fullWidth
                        />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <FormControl required variant="outlined" fullWidth className={classes.formControl}>
                                <InputLabel
                                    id="demo-simple-select-outlined-label">Tipo de contrato</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="contract"
                                    name="contract"
                                    value={dressmaker.contract}
                                    onChange={updateField}
                                    label="Tipo de contrato"
                                >
                                    <MenuItem value={'PJ'}>PJ</MenuItem>
                                    <MenuItem value={'CLT'}>CLT</MenuItem>
                                </Select>
                            </FormControl>
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
                                    id="admission"
                                    name="admission"
                                    label="Data de admissão"
                                    invalidDateMessage="Formato da data inválido"
                                    value={dressmakerAdmission}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
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
                            {`${dressmaker.id ? 'Atualizar' : 'Cadastrar'}`}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(2),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));
