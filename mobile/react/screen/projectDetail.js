import Colors from "../assets/color/Colors";
import {Button, Header, Icon, Image} from "react-native-elements";
import React from "react";
import {View, StyleSheet, Text, ImageBackground} from 'react-native';

export default class projectDetail extends React.Component{

    constructor(props){
        super(props);
        this.ws = this.props.screenProps.ws;
    }

    static valueToResolution(value){
        switch (value) {
            case 0:
                return "640x480";
            case 1:
                return "1640x1232";
            case 2:
                return "3240x2464";
            default:
                return "no resolution";
        }
    }

    render(){
        const { goBack } = this.props.navigation;
        const {state} = this.props.navigation;
        const project_data = state.params.data;

        const imageBackgroundUri = require('../devEnv/dev_data/assets/white-noise.jpg');
        return(
            <View style={style_projectDetail.container}>
                <Header
                    centerComponent={{text: project_data.name, style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    leftComponent={<Icon name={"arrow-left"} size={25} color={'#fff'} type='font-awesome'
                                         onPress={() => goBack()}/>}
                    rightComponent={<Icon name={"delete-forever"} size={27} color={'#fff'} type='material-community'
                                          onPress={() => this.ws.request_remove_project(project_data.name)}/>}
                />

                <View style={style_projectDetail.body}>
                    <Image source={imageBackgroundUri} style={{width: '100%', height: 220}}/>
                    <View style={{flex:1, padding: 5}}>
                        <View style={style_projectDetail.bloc}>
                            <Text style={style_projectDetail.input_label}> Description : </Text>
                            <Text style={style_projectDetail.input_label_sec}> {project_data.description} </Text>
                        </View>

                        <View style={style_projectDetail.bloc}>
                            <Text style={style_projectDetail.input_label}> Picture per rotation : </Text>
                            <Text style={style_projectDetail.input_label_sec}> {project_data.pict_per_rotation} </Text>
                        </View>

                        <View style={style_projectDetail.bloc}>
                            <Text style={style_projectDetail.input_label}> Picture resolution : </Text>
                            <Text style={style_projectDetail.input_label_sec}> {projectDetail.valueToResolution(project_data.pict_res)} </Text>
                        </View>

                        <View style={style_projectDetail.bloc}>
                            <Text style={style_projectDetail.input_label}> Size : </Text>
                            <Text style={style_projectDetail.input_label_sec}> {project_data.size} mb </Text>
                        </View>

                        <View style={style_projectDetail.bloc_center}>
                            <Button
                                containerStyle={{width: '80%', marginTop: 50}}
                                buttonStyle={{backgroundColor: Colors.colorPrincipal}}
                                onPress={() => {this.ws.start_loop_capture(project_data.name)}}
                                title="start loop"
                            />
                        </View>
                    </View>
                </View>
            </View>



        )
    }

}

const style_projectDetail = new StyleSheet.create({
    container : {
        flex: 1,
    },
    body: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start'
    },
    bloc: {
        marginVertical: 5
    },
    bloc_center: {
        marginVertical: 5,
        alignItems: 'center'
    },
    input_label:{
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        color:Colors.colorPrincipal
    },
    input_label_sec:{
        fontSize: 18,
        fontWeight: '500',
    },
});