import React from "react";

// import { AuthContext } from "../../auth/context/AuthContextProvider";

import { makeStyles } from "@material-ui/core/styles";

import ToolbarApp from "./ToolbarApp";
import NavDrawer from "./navDrawer/NavDrawer";

import Container from "@material-ui/core/Container";

export const drawerWidth = 258;

export default function Main(props) {
  const { children } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <>
        <ToolbarApp open={open} handleDrawerOpen={handleDrawerOpen} />
        <NavDrawer open={open} handleDrawerClose={handleDrawerClose} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {children}
          </Container>
        </main>
      </>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));
