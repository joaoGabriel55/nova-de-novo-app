import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Tooltip from '@material-ui/core/Tooltip';
// import Divider from '@material-ui/core/Divider';

import { NavLink as RouterLink } from 'react-router-dom';

const CustomRouterLink = forwardRef((props, ref) => (
    <div
        ref={ref}
        style={{ flexGrow: 1 }}
    >
        <RouterLink {...props} />
    </div>
));

export default function ListItems(props) {
    const { pages } = props
    const classes = useStyles()
    return (
        <div className={classes.list}>
            {pages.map(page => (
                <ListItem
                    key={page.title}
                    button
                    component={CustomRouterLink}
                    to={page.href}
                    activeClassName={page.href === '/home' ? classes.activeHomeItem : classes.activeItem}
                    className={page.href === '/home' ? classes.listHomeItem : classes.listItem}>
                    <ListItemIcon
                        className={page.href === '/home' ? classes.listHomeItemIcon : classes.listItemIcon}>
                        {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.title} />
                </ListItem>
            ))}
        </div>
    )
}


const useStyles = makeStyles((theme) => ({
    list: {
        color: theme.palette.secondary.main
    },
    activeHomeItem: {
        backgroundColor: theme.palette.primary.dark,
        '& $icon': {
            backgroundColor: theme.palette.primary.dark
        },
        '&:hover': {
            background: theme.palette.primary.dark,
        },
    },
    activeItem: {
        backgroundColor: theme.palette.secondary.light,
        fontWeight: theme.typography.fontWeightMedium,
        '& $icon': {
            backgroundColor: theme.palette.secondary.light
        },
        '&:hover': {
            background: theme.palette.secondary.light,
        },
    },
    listHomeItem: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            background: theme.palette.primary.dark,
        },
        color: 'white'
    },
    listHomeItemIcon: {
        color: 'white',
    },
    listItem: {
        marginTop: 16
    },
    listItemIcon: {
        color: theme.palette.secondary.main
    }
}))