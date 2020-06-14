import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { drawerWidth } from "../Main";

import ListItems from './ListItems'

import {
    Home, Receipt, MonetizationOn, Assignment, Contacts, SupervisedUserCircle, PersonAdd
} from '@material-ui/icons'

const pages = [
    {
        title: 'Home',
        href: '/home',
        icon: <Home />
    },
    {
        title: 'Gerar Ordem de Serviço',
        href: '/ordem-de-servico',
        icon: <Receipt />
    },
    {
        title: 'Mapa de produção',
        href: '/mapa-de-producao',
        icon: <Assignment />
    },
    {
        title: 'Clientes',
        href: '/clientes',
        icon: <Contacts />
    },
    {
        title: 'Costureiras',
        href: '/costureiras',
        icon: <SupervisedUserCircle />
    },
    {
        title: 'Usuários',
        href: '/usuarios',
        icon: <PersonAdd />
    },
    {
        title: 'Finanças',
        href: '/financas',
        icon: <MonetizationOn />
    }
];

function NavDrawer(props) {
    const classes = useStyles();

    const { handleDrawerClose, open } = props
    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItems open={open} pages={pages} />
            </List>
            <Divider />
        </Drawer>
    )
}

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        color: theme.palette.secondary.main,
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    }
}))

export default NavDrawer;