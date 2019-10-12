import "isomorphic-unfetch";
import React, { useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CreateIcon from "@material-ui/icons/Create";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import FacebookBox from "mdi-material-ui/FacebookBox";
import ForumIcon from "@material-ui/icons/Forum";
import Hidden from "@material-ui/core/Hidden";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import InputBase from "@material-ui/core/InputBase";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import Link from "./Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MuiLink from "@material-ui/core/Link";
import RateReviewIcon from "@material-ui/icons/RateReview";
import SearchIcon from "@material-ui/icons/Search";
import SignInDialog from "../components/dialogs/SignInDialog";
import SignUpDialog from "../components/dialogs/SignUpDialog";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import firebase from "firebase/app";
import "firebase/auth";
import clientCredentials from "../credentials/client";

import { useStateValue } from "../store";
import { setUser, setDialog } from "../actions";

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  logo: {
    width: theme.spacing(7),
    margin: theme.spacing(0, 2, 0, 0),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  logoHide: {
    width: 0,
    margin: 0,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  search: {
    position: "relative",
    borderRadius: "100px",
    backgroundColor: theme.palette.grey["200"],
    "&:hover": {
      backgroundColor: theme.palette.grey["100"]
    },
    "&:focus-within": {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`
    },
    width: "100%"
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0
  },
  svgSearchIcon: {
    color: theme.palette.action.active
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1.25, 1, 0.75, 7),
    width: "100%"
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 1
  },
  toolbar: {
    padding: theme.spacing(0, 0, 0, 2),
    ...theme.mixins.toolbar
  },
  inline: {
    display: "inline"
  },
  listItem: {
    margin: theme.spacing(1),
    width: "auto",
    borderRadius: theme.spacing(1)
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  facebookIcon: {
    verticalAlign: "middle",
    marginLeft: theme.spacing(1)
  },
  sponsorIcon: {
    verticalAlign: "middle",
    height: theme.spacing(6)
  }
}));

export default function MainNav(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchFocus, setSearchFocus] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [{ user, dialog }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.initializeApp(clientCredentials);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        dispatch(setDialog(null));
        return user.getIdToken().then(token => {
          // eslint-disable-next-line no-undef
          return fetch("/api/login", {
            method: "POST",
            // eslint-disable-next-line no-undef
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ token })
          });
        });
      } else {
        dispatch(setUser(null));
        // eslint-disable-next-line no-undef
        fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin"
        });
      }
    });
  }, []);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    if (!user) dispatch(setDialog("sign-in"));
    else firebase.auth().signOut();
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOn = () => {
    if (isDesktop) {
      handleDrawerOpen();
    } else {
      handleDrawerToggle();
    }
  };

  const handleDrawerOff = () => {
    if (isDesktop) {
      handleDrawerClose();
    } else {
      handleDrawerToggle();
    }
  };

  const handleSearchFocus = focused => () => {
    setSearchFocus(focused);
  };

  const handleDialogClose = () => {
    dispatch(setDialog(null));
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleAccountClick}>
        {!user ? "تسجيل الدخول" : "تسجيل الخروج"}
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <React.Fragment>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {user && user.photoURL ? (
              <Avatar alt="user avatar" src={user.photoURL} />
            ) : (
              <AccountCircleTwoTone fontSize="large" />
            )}
          </ListItemAvatar>
          <ListItemText
            primary="مرحباً بك"
            secondary={user && user.displayName ? user.displayName : "مجهول"}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="close drawer"
              onClick={handleDrawerOff}
            >
              {isDesktop ? (
                theme.direction === "rtl" ? (
                  <KeyboardArrowRightRoundedIcon />
                ) : (
                  <KeyboardArrowLeftRoundedIcon />
                )
              ) : (
                <KeyboardArrowDownRoundedIcon />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem className={classes.listItem} button selected>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="الصفحة الرئيسية" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <RateReviewIcon />
          </ListItemIcon>
          <ListItemText primary="أخر المراجعات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="المقالات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary="المنتديات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="نبذة عنا" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  function Copyright() {
    return (
      <React.Fragment>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          gutterBottom
        >
          {"مدعوم من قبل "}
          <MuiLink color="inherit" href="http://ihub.asu.edu.eg/">
            <img
              className={classes.sponsorIcon}
              src="/static/images/iHub.png"
              alt="iHun logo"
            ></img>
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {"حقوق النشر محفوظة © "}
          <Link color="inherit" href="/">
            URrevs
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
          <MuiLink color="inherit" href="https://www.facebook.com/URrevs/">
            <FacebookBox className={classes.facebookIcon} />
          </MuiLink>
        </Typography>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className={clsx(classes.root, classes.grow)}>
        <ElevationScroll {...props}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
            color="inherit"
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOn}
                edge="start"
                className={clsx({
                  [classes.hide]: open
                })}
              >
                <MenuIcon />
              </IconButton>
              <img
                className={clsx(classes.logo, {
                  [classes.logoHide]: searchFocus
                })}
                src="/static/images/logo.png"
                alt="logo"
              />
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon color="action" />
                </div>
                <InputBase
                  fullWidth
                  placeholder="ابحث عن هاتف"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                  inputProps={{
                    "aria-label": "search"
                  }}
                  onFocus={handleSearchFocus(true)}
                  onBlur={handleSearchFocus(false)}
                />
              </div>
              <IconButton
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user && user.photoURL ? (
                  <Avatar
                    className={classes.avatar}
                    alt="user avatar"
                    src={user.photoURL}
                  />
                ) : (
                  <AccountCircleTwoTone />
                )}
              </IconButton>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        {renderMenu}
        <nav aria-label="site pages">
          <Hidden smUp implementation="css">
            <SwipeableDrawer
              anchor="bottom"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
              PaperProps={{
                square: false
              }}
              disableBackdropTransition={!iOS}
              disableSwipeToOpen={false}
              onOpen={handleDrawerToggle}
            >
              {drawer}
            </SwipeableDrawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open
                })
              }}
              open={open}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container component="main" maxWidth="md">
            {props.children}
          </Container>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
      <Dialog
        open={dialog === "sign-in"}
        onClose={handleDialogClose}
        aria-labelledby="sign-in-dialog"
      >
        <SignInDialog />
      </Dialog>
      <Dialog
        open={dialog === "sign-up"}
        onClose={handleDialogClose}
        aria-labelledby="sign-up-dialog"
      >
        <SignUpDialog />
      </Dialog>
    </React.Fragment>
  );
}

MainNav.propTypes = {
  children: PropTypes.object.isRequired
};
