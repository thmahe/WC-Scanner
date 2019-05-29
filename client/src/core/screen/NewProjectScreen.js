
import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    }
});

function getSteps() {
    return ["Nom du Dossier", "Caractéristiques de l'objet", "Qualité du scan"];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
        case 1:
            return 'An ad group contains one or more ads which target a shared set of keywords.';
        case 2:
            return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
        default:
            return 'Unknown step';
    }
}

class NewProjectScreen extends React.Component{

    state = {
        activeStep: 0,
        nameProject: '',
        longeurObject: '',
        hauteurObject: '',
        profondeurObject: '',
        qualityScan: 'Normal',
    };

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    renderComponent(step){
        const { classes } = this.props;
        switch(step){
            case 0:
                return (
                <TextField
                    required
                    id="outlined-name"
                    label="Nom du projet"
                    className={classes.textField}
                    value={this.state.nameProject}
                    onChange={this.handleChange('nameProject')}
                    margin="normal"
                    variant="outlined"
                />);
            case 1:
                return (
                    <div>
                        <TextField
                            required
                            id="outlined-name"
                            label="Longeur"
                            className={classes.textField}
                            value={this.state.longeurObject}
                            onChange={this.handleChange('longeurObject')}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                        />
                        <TextField
                            required
                            id="outlined-name"
                            label="Hauteur"
                            className={classes.textField}
                            value={this.state.hauteurObject}
                            onChange={this.handleChange('hauteurObject')}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                        />
                        <TextField
                            required
                            id="outlined-name"
                            label="Profondeur"
                            className={classes.textField}
                            value={this.state.profondeurObject}
                            onChange={this.handleChange('profondeurObject')}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                        />
                    </div>);
            case 2:
                return(
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Qualité du scan</FormLabel>
                        <RadioGroup
                            aria-label="Gender"
                            name="gender1"
                            className={classes.group}
                            value={this.state.qualityScan}
                            onChange={this.handleChange('qualityScan')}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Bas" />
                            <FormControlLabel value="male" control={<Radio />} label="Normal" />
                            <FormControlLabel value="other" control={<Radio />} label="Haut" />
                        </RadioGroup>
                    </FormControl>
                )
        }
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                <Typography>{getStepContent(index)}</Typography>
                                <div className={classes.actionsContainer}>
                                    <div>
                                        {this.renderComponent(index)}
                                    </div>
                                    <div>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={this.handleBack}
                                            className={classes.button}
                                        >
                                            Retour
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 ? 'Fini' : 'Suivant'}
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>Toutes les étapes sont finies</Typography>
                        <Button onClick={this.handleReset} className={classes.button}>
                            C'est partie
                        </Button>
                    </Paper>
                )}
            </div>
        );
    }
}

NewProjectScreen.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewProjectScreen);