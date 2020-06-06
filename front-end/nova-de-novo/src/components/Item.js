import React from 'react';
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(3),
        width: 345,
    },
    media: {
        height: 140,
    },
    title: {
        color: theme.palette.secondary.main
    }
}))

function Item() {
    const classes = useStyles()

    return (<>
        <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            OMG it's a Monkey!
          </Typography>
    </>)
}

export default Item;