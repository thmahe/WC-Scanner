import * as React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import Build from "@material-ui/core/SvgIcon/SvgIcon";
import Person from '@material-ui/icons/Person';
import Wifi from '@material-ui/icons/Wifi';
import PropTypes from "prop-types";
import {fade} from "@material-ui/core/styles/colorManipulator";
import {withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const websocket = new WebSocket("ws://wcscanner.local:6789/"); //new WebSocket("ws://10.3.141.1:6789/") RPI

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

class HomeScreen extends React.Component{

    constructor(props){
        super(props);
    }

    state={
        connect: false,
        open: false,
        angle: 90,
        userNb: 0,
        buildNb: null,
    };

    componentDidMount() {
        let that = this;
        websocket.onmessage = function (event) {
            let data = JSON.parse(event.data);
            that.setState({connect: data != null });
            switch (data.type) {
                case 'users':
                    //document.getElementById('users').innerText = data.count.toString() + " user" + (data.count > 1 ? "s" :"");
                    that.setState({userNb: data.count == null ? '0' : data.count.toString()});

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
        return(
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
                                    onChange={(angle) => this.setState({angle: angle})}/>
                            </div>
                            <Button variant="contained" className={classes.button} style={{fontSize: 20}} onClick={() =>  websocket.send(JSON.stringify({action : "turn_bed_CCW", plateau_degree : this.state.angle}))}>
                                Right
                            </Button>
                        </div>
                    </div>
                    <div style={{display:'flex', backgroundColor: '#fff', width: '100%', height: '20%', flexDirection: 'row', alignItems:'center', justifyContent:'space-evenly'}}>

                        <Link to='/loadProject' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary" className={classes.button} style={{fontSize: 20}} >
                                Voir un projet
                            </Button>
                        </Link>

                        <Link to='/newProject' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="primary" className={classes.button} style={{fontSize: 20}}>
                                Commencer un projet
                            </Button>
                        </Link>

                    </div>
                </div>
                <div style={{display:'flex', backgroundColor: '#4254B2', width: '100%', height: 80, justifyContent: 'space-around', alignItems:'center' }}>
                    <div style={{display:'flex', color: '#fff', width: 200, alignItems:'center',  justifyContent:'space-around'}}>
                        <Build style={{color: '#fff', fontSize: 40 }}/>
                        <p style={{fontSize: 20}}> {this.state.buildNb} build en attente </p>
                    </div>

                    <div style={{display:'flex', color: '#fff', width: 200, alignItems:'center', justifyContent:'space-around'}}>
                        <Person style={{color: '#fff', fontSize: 40 }}/>
                        <p style={{fontSize: 20}}> {this.state.userNb} personne en ligne </p>
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
                            <p style={{fontSize: 20}}> connecté </p>
                        </div> :
                        <div style={{
                            display: 'flex',
                            color: '#fff',
                            width: 180,
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Wifi style={{color: '#fff', fontSize: 40}}/>
                            <p style={{fontSize: 20}}> non connecté </p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

HomeScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeScreen);