import Colors from "../assets/color/Colors";
import {Button, Header, Icon, Input, Slider} from "react-native-elements";
import React from "react";
import {StyleSheet, Text, View, ScrollView, Platform} from 'react-native';
import { StatusBar } from 'react-native';
import websocketUtil from "../utils/websocket";

export default class NewProjectScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            project_name: "",
            project_description: "",
            project_ppr: "1",
            project_picture_resolution: "1"
        };

        this.ws = this.props.screenProps.ws;
    }

    evaluation_size(){
        let new_placeholder = "Estimated size : ";

        let picture_res = this.state.project_picture_resolution;
        let total_pictures = 3 * this.state.project_ppr;

        let picture_size;
        // in KB
        switch (picture_res + "") {
            case "1" :
                picture_size = 62;
                break;
            case "2" :
                picture_size = 413;
                break;
            case "3" :
                picture_size = 1650;
                break;
            default :
                picture_size = 0
        }

        return new_placeholder + " " + (picture_size * total_pictures) / 1000;
    }

    jsonCreateProject(){

        let project_picture_res_TO_string = "";
        if (this.state.project_picture_resolution === "1"){project_picture_res_TO_string = '640x480'}
        else if (this.state.project_picture_resolution === "2"){project_picture_res_TO_string = '1640x1232' }
        else if (this.state.project_picture_resolution === "3"){project_picture_res_TO_string = '3280x2464' }

        return {
            project_name: this.state.project_name,
            project_description: this.state.project_description,
            project_ppr: this.state.project_ppr,
            project_picture_resolution: project_picture_res_TO_string
        }
    };

    render(){
        const { goBack } = this.props.navigation;
        const {state} = this.props.navigation;

        let textResolutionPicture;
        if (this.state.project_picture_resolution === "1"){textResolutionPicture = <Text> 640x480 </Text>}
        else if (this.state.project_picture_resolution === "2"){textResolutionPicture = <Text> 1640x1232 </Text>}
        else if (this.state.project_picture_resolution === "3"){textResolutionPicture = <Text> 3280x2464 </Text>}

        return(
            <View style={styleControl.container}>
                <Header
                    centerComponent={{text: 'Nouveau Projet', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    leftComponent={<Icon name={"arrow-left"} size={25} color={'#fff'} type='font-awesome'
                                         onPress={() => goBack()}/>}
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                />


                <ScrollView>
                    <View style={{alignItems:'center', height: '100%'}}>
                        <Input
                            label='Nom de projet'
                            inputContainerStyle={this.state.project_name === '' ? styleControl.input_container : styleControl.input_container_focus}
                            containerStyle={{width: "90%",  margin: 10}}
                            onChangeText={name => this.setState({ project_name: name })}
                            labelProps={{style: styleControl.input_label}}
                            value={this.state.project_name}
                        />

                        <Input
                            label='Description'
                            inputContainerStyle={this.state.project_description === '' ? styleControl.input_container : styleControl.input_container_focus}
                            containerStyle={{width: "90%",  margin: 10}}
                            multiline={true}
                            onChangeText={name => this.setState({ project_description: name })}
                            labelProps={{style: styleControl.input_label}}
                            value={this.state.project_description}
                        />

                        <View style={{width: "90%",  margin: 10, alignItems: 'center'}}>
                            <Text style={styleControl.input_label_text}> Picture resolution </Text>
                            <Slider
                                value={parseInt(this.state.project_picture_resolution)}
                                maximumValue={3}
                                minimumValue={1}
                                step={1}
                                style={{width: '90%'}}
                                thumbTintColor={Colors.colorPrincipal}
                                onValueChange={value => this.setState({ project_picture_resolution: value.toString() })}
                            />
                            <Text style={styleControl.input_label_text}> {textResolutionPicture} </Text>
                        </View>

                        <View style={{width: "90%",  margin: 10, alignItems: 'center'}}>
                            <Text style={styleControl.input_label_text}> Picture per resolution </Text>
                            <Slider
                                value={parseInt(this.state.project_ppr)}
                                maximumValue={36}
                                minimumValue={1}
                                step={1}
                                style={{width: '90%'}}
                                thumbTintColor={Colors.colorPrincipal}
                                onValueChange={value => this.setState({ project_ppr: value.toString() })}
                            />
                            <Text style={styleControl.input_label_text}> {this.state.project_ppr} </Text>
                        </View>

                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color:Colors.grayTextColor}}> {this.evaluation_size()} </Text>

                        <Button
                            containerStyle={{width: '80%', marginTop: 20}}
                            buttonStyle={{backgroundColor: Colors.colorPrincipal}}
                            onPress={() => {
                                goBack();
                                this.ws.create_project(this.jsonCreateProject())}}
                            title="Crée un projet"
                        />
                    </View>
                </ScrollView>
            </View>


        );
    }
}

export const styleControl = StyleSheet.create({
    container : {
        flex: 1,
    },
    containerControl: {
        width: '100%',
        height: 400,
        flexDirection: 'row',
    },
    input_label:{
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        color:Colors.grayTextColor
    },
    input_label_text:{
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        alignSelf: 'flex-start',
        color: Colors.grayTextColor
    },
    input_container:{
        borderRadius: 15,
        borderColor: Colors.colorPrincipal,
        borderWidth: 0.4,
        paddingLeft: 10
    },
    input_container_focus:{
        borderColor: Colors.grayColor,
        borderRadius: 15,
        borderWidth: 1.4,
        paddingLeft: 10
    },
});