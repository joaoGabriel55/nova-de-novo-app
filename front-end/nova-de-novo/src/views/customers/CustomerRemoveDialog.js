import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider'

export default function CustomerRemoveDialog(props) {
    const { deleteDataList, deleteData, openDeleteDataDialog } = props
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (deleteDataList) {
            handleClickOpen()
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        openDeleteDataDialog()
        setOpen(false);
    };

    const handleDeleteData = async () => {
        await deleteData()
        handleClose()
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Desejas remover este(s) clientes?"}</DialogTitle>
                <DialogContent>
                    <List>
                        {deleteDataList ? deleteDataList.map((elem) => (
                            <ListItem key={elem.id}>
                                <ListItemText primary={elem.name} />
                            </ListItem>
                        )) : null}
                    </List>
                </DialogContent>
                <br></br>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteData}
                        variant="contained"
                        color="primary"
                        autoFocus
                        style={{ color: 'white' }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
