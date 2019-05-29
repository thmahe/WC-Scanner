import React from 'react';
import PropTypes from 'prop-types';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import Settings from '@material-ui/icons/Settings';
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Main from "./core/screen/Main";
import {Link} from "react-router-dom";

const styles = theme => ({
  root: {
    flex:1,
  },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    paramButton: {
        marginLeft: 20,
        marginRight: -12,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
});


class App extends React.Component {
    constructor(props){
        super(props);
    }

    state={
        open: false,
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    handleChange = (event, angle) => {
        this.setState({ angle });
    };


    render() {
        const { classes } = this.props;
        const { open } = this.state;
        return (
            <div style={{display: 'flex', height: '100vh', flexDirection: 'column'}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton} color="inherit" aria-label="Open drawer"
                            buttonRef={node => {
                                this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleToggle}>
                            <MenuIcon />
                        </IconButton>
                        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    id="menu-list-grow"
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={this.handleClose}>
                                            <MenuList>
                                                <MenuItem onClick={this.handleClose}>
                                                    <Link to='/' style={{ textDecoration: 'none' }}> Home </Link>
                                                </MenuItem>
                                                <MenuItem onClick={this.handleClose}>
                                                    <Link to='/newProject' style={{ textDecoration: 'none' }}> Créer </Link>
                                                </MenuItem>
                                                <MenuItem onClick={this.handleClose}>
                                                    <Link to='/loadProject' style={{ textDecoration: 'none' }}> Projets </Link>
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            WC Scanner
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <IconButton className={classes.paramButton} color="inherit" aria-label="Open drawer">
                            <Settings />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Main/>
            </div>
        );
  }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);