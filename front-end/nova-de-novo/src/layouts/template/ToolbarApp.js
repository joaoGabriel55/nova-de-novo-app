import React from 'react';
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContextProvider";

import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { makeStyles } from '@material-ui/core/styles';

import { drawerWidth } from "./Main";

import theme from '../../theme';

export default function ToolbarApp(props) {
    const classes = useStyles();
    const history = useHistory();

    const [userLogged, setUserLogged] = React.useContext(AuthContext);

    function logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        if(userLogged)
            setUserLogged(null)
        history.replace('/sign-in')
    }

    const { handleDrawerOpen, open } = props
    return (
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    <span style={{ color: theme.palette.secondary.main }}>Nova de Novo</span>
                </Typography>
                <IconButton color="inherit" onClick={() => logout()}>
                    <Tooltip title="Sair" aria-label="exit">
                        <ExitToAppIcon color="secondary" />
                    </Tooltip>
                    {/* <Badge badgeContent={4} color="secondary">
                       
                    </Badge> */}
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

const useStyles = makeStyles((theme) => ({
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'white',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
        color: theme.palette.secondary.main
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    }
}))