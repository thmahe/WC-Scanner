import Colors from "../assets/color/Colors";
import {Header, Icon, Input, Slider} from "react-native-elements";
import React from "react";
import {StyleSheet, View, Text} from 'react-native';

export default class NewProjectScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            project_name: "",
            project_description: "",
            project_ppr: "",
            project_picture_resolution: 0
        };
    }

    render(){
        const { goBack } = this.props.navigation;
        return(
            <View style={styleControl.container}>
                <Header
                    centerComponent={{text: 'Nouveau Projet', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    leftComponent={<Icon name={"arrow-left"} size={25} color={'#fff'} type='font-awesome'
                                         onPress={() => goBack()}/>}
                />

                <View style={{flex:1, alignItems:'center'}}>
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

                    <Text style={styleControl.input_label_text}> Picture resolution </Text>
                    <Slider
                        value={this.state.value}
                        maximumValue={2}
                        minimumValue={0}
                        step={1}
                        style={{width: '90%'}}
                        thumbTintColor={Colors.colorPrincipal}
                        onValueChange={value => this.setState({ project_picture_resolution: value })}
                    />
                </View>
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
    },
    input_label_text:{
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        alignSelf: 'flex-start',
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