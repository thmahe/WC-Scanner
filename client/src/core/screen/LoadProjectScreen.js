import React from "react";
import Card from "@material-ui/core/es/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";
import {CircularProgress} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        minWidth: 200,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    progress: {

    },
    table: {
        minWidth: 10,
    },

});

let id = 0;
function createData(longueur, largeur, profondeur, qualite) {
    id += 1;
    return {longueur, largeur, profondeur, qualite};
}

class LoadProjectScreen extends React.Component{

    render() {
        const { classes } = this.props;

        const rows = [
            createData(10, 15, 12, "normal"),
        ];

        const projects = [
            {
                projectId : '44ASRA1',
                creatorID: '214ZAS123',
                state: 'ok',
                date: 'janvier 2019',
                sensibilite: 'high',
                img: [
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                ],
                url_file_3D: 'blabla'
            },
            {
                projectId : 'test 2',
                creatorID: '214ZAS123',
                state: 'ok',
                date: 'janvier 2019',
                sensibilite: 'high',
                img: [
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                ],
                url_file_3D: 'blabla'
            },
            {
                projectId : 'test3',
                creatorID: '214ZAS123',
                state: 'ok',
                date: 'janvier 2019',
                sensibilite: 'high',
                img: [
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                ],
                url_file_3D: 'blabla'
            },
            {
                projectId : 'test4',
                creatorID: '214ZAS123',
                state: 'ok',
                date: 'janvier 2019',
                sensibilite: 'high',
                img: [
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                    {
                        img_url: '',
                        img_token: '',
                    },
                ],
                url_file_3D: 'blabla'
            }

        ];

        return(
            <div style={{display: 'flex', justifyContent:'center', alignItems:'center', flexDirection: 'column'}}>
                {
                    projects.map((item, index) =>
                    {<Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {item.projectId}
                            </Typography>
                            <Paper className={classes.root}>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Longueur</TableCell>
                                            <TableCell align="center">Largeur</TableCell>
                                            <TableCell align="center">Profondeur</TableCell>
                                            <TableCell align="center">Qualité</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">{row.longueur}</TableCell>
                                                <TableCell align="center">{row.largeur}</TableCell>
                                                <TableCell align="center">{row.profondeur}</TableCell>
                                                <TableCell align="center">{row.qualite}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>

                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginTop:10}}>
                                Progression
                                <CircularProgress className={classes.progress} variant={"static"} value={75}/>
                            </div>
                        </CardContent>
                    </Card>
                    } )
                }
            </div>
        );
    }
}

LoadProjectScreen.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(LoadProjectScreen);