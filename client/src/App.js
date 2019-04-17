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
import Person from '@material-ui/icons/Person';
import Build from '@material-ui/icons/Build';
import Button from "@material-ui/core/Button";
import Settings from '@material-ui/icons/Settings';
import Wifi from '@material-ui/icons/Wifi';
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from '@material-ui/lab/Slider';

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

const websocket = new WebSocket("ws://localhost:6789/"); //new WebSocket("ws://10.3.141.1:6789/") RPI

class App extends React.Component {
    constructor(props){
        super(props);
    }

    state={
        connect: false,
        open: false,
        angle: 90,
        userNb: null,
        buildNb: null,
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

    componentDidMount() {

        websocket.onmessage = function (event) {
            let data = JSON.parse(event.data);
            console.log(data);
            switch (data.type) {
                case 'users':
                    //document.getElementById('users').innerText = data.count.toString() + " user" + (data.count > 1 ? "s" :"");
                    this.setState({userNb: data.count == null ? '0' : data.count.toString()});
                    break;
                case 'state':
                    //@TODO capter les changements dans les variables du scanner
                    break;
                default:
                    console.error(
                        "unsupported event", data);
            }
        };
    }

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
                                                <MenuItem onClick={this.handleClose}>Home</MenuItem>
                                                <MenuItem onClick={this.handleClose}>Projet</MenuItem>
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

                <div style={{display:'flex', width: '100%', height: '100%',flexDirection: 'column'}}>
                    <div style={{display:'flex', width: '100%', height: '100%', flexDirection: 'column', alignItems:'center'}}>
                        <p style={{fontSize: 30, fontWeight: '700'}}>Bienvenue</p>
                        <div style={{display:'flex', width: '100%', height: '80%', alignItems:'center'}}>
                            <div style={{display:'flex', width: '100%', height: '20%', flexDirection: 'row', alignItems:'center', justifyContent:'space-evenly'}}>
                                <Button variant="contained" className={classes.button} style={{fontSize: 20}} onClick={() => websocket.send(JSON.stringify({action : "turn_bed_CW", plateau_degree : this.state.angle}))}>
                                    Left
                                </Button>
                                <div>
                                    <Typography id="label">angle de rotation : {this.state.angle}</Typography>
                                    <Slider
                                        value={this.state.angle}
                                        style={{padding: '22px 0px', width: 200}}
                                        aria-labelledby="label"
                                        max='360'
                                        step='1'
                                        onChange={this.handleChange}/>
                                </div>
                                <Button variant="contained" className={classes.button} style={{fontSize: 20}} onClick={() =>  websocket.send(JSON.stringify({action : "turn_bed_CCW", plateau_degree : this.state.angle}))}>
                                    Right
                                </Button>
                            </div>
                        </div>
                        <div style={{display:'flex', backgroundColor: '#fff', width: '100%', height: '20%', flexDirection: 'row', alignItems:'center', justifyContent:'space-evenly'}}>
                            <Button variant="contained" color="primary" className={classes.button} style={{fontSize: 20}}>
                                Voir un projet
                            </Button>

                            <Button variant="contained" color="primary" className={classes.button} style={{fontSize: 20}}>
                                Commencer un projet
                            </Button>
                        </div>
                    </div>
                    <div style={{display:'flex', backgroundColor: '#4254B2', width: '100%', height: 80, justifyContent: 'space-around', alignItems:'center' }}>
                        <div style={{display:'flex', color: '#fff', width: 200, alignItems:'center',  justifyContent:'space-around'}}>
                            <Build style={{color: '#fff', fontSize: 40 }}/>
                            <p style={{fontSize: 20}}> {this.state.buildNb} build en attente </p>
                        </div>

                        <div style={{display:'flex', color: '#fff', width: 200, alignItems:'center', justifyContent:'space-around'}}>
                            <Person style={{color: '#fff', fontSize: 40 }}/>
                            <p style={{fontSize: 20}}> {this.state.userNb} persone en ligne </p>
                        </div>

                        { this.state.connect ?
                            <div style={{
                                display: 'flex',
                                color: '#fff',
                                width: 150,
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}>
                                <Wifi style={{color: '#fff', fontSize: 40}}/>
                                <p style={{fontSize: 20}}> connecter </p>
                            </div> :
                            <div style={{
                                display: 'flex',
                                color: '#fff',
                                width: 180,
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}>
                                <Wifi style={{color: '#fff', fontSize: 40}}/>
                                <p style={{fontSize: 20}}> non connecter </p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
  }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);