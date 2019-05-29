import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import StreamedianPlayer from "../../streamdian/StreamedianPlayer";



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        margin: '0.5%',
        maxWidth: "48%",
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
});

class LoadProjectScreen extends React.Component{

    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };


    render() {
        const { classes } = this.props;

        const projects = [
            {
                projectId : '44ASRA1',
                creatorID: 'Autor1',
                state: 'ok',
                date: 'janvier 2019',
                sensibilite: 'high',
                img: [
                    {
                        img_url: 'https://material-ui.com/static/images/grid-list/breakfast.jpg',
                        img_token: 'testImageToken',
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
                creatorID: 'Autor2',
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
                creatorID: 'Autor3',
                state: 'ok',
                date: 'février 2019',
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
                creatorID: 'Autor4',
                state: 'ok',
                date: 'mars 2019',
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
                projectId : 'test5',
                creatorID: 'Autor5',
                state: 'ok',
                date: 'avril 2019',
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

            <div className={classes.root}>

                <div style={{height: 300, width:'100%', alignItems: 'center', justifyContent: 'center', display:'flex', marginBottom: 10}}>
                    <video id="test_video" controls width='100%' height={300}>
                        <source src="rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov" />
                    </video>
                </div>

                <div style={{height: '100%', widht: '100'}}>
                    <GridList cellHeight={180} className={classes.gridList}>
                        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        </GridListTile>
                        {projects.map(item => (

                            <Paper className={classes.paper}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <ButtonBase className={classes.image}>
                                            <img className={classes.img} alt="image" src="/static/images/grid/complex.jpg" />
                                        </ButtonBase>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs container direction="column" spacing={2}>
                                            <Grid item xs>
                                                <Typography gutterBottom variant="subtitle1">
                                                    {item.projectId}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Résolution : {item.sensibilite} • JPEG
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Auteur : {item.creatorID}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                                    Supprimer
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1"> {item.date} </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>

                        ))}
                    </GridList>
                </div>



            </div>
        );
    }
}

LoadProjectScreen.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(LoadProjectScreen);