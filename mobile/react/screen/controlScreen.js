import React from 'react';
import {StyleSheet, View, Image, Text, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import {Button, Header, Icon, Input, Overlay} from "react-native-elements";
import Colors from "../assets/color/Colors";
import websocketUtil from "../utils/websocket";
import {connect} from "react-redux";
import { StatusBar } from 'react-native';

const mapStateToProps = (state) => {
    return {
        image_preview : state.image_preview,
    }
};

class controlScreen extends React.Component{

    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'remote';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : Colors.grayColor} type='material-community'/>;
        },
    };

    constructor(props){
        super(props);
        this.state = {
            angle: "0",
            modalView: false
        };
        this.ws = this.props.screenProps.ws;
    }

    render(){
        const scannerbg = require('../assets/scanner_bg.png');
        return(
                <View style={styleControl.container}>
                    <Header
                        centerComponent={{text: 'Controle', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                        backgroundColor={Colors.colorPrincipal}
                        rightComponent={<Icon name={"video-camera"} size={25} color={'#fff'} type='font-awesome'
                                              onPress={() => {this.setState({modalView: true})}}/>}
                        containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    />

                    <KeyboardAvoidingView
                        style = {{ flex: 1 }}
                        behavior= {(Platform.OS === 'ios')? "padding" : null}>
                        <View style={styleControl.containerControl}>
                            <ScrollView>
                                <View style={{width: '100%', flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center', marginVertical: 10}}>
                                    <Icon name={"rotate-right"} size={50} color={Colors.colorPrincipal} type='material-community'
                                          onPress={() => this.ws.turn_bed_CCW_trigger(this.state.angle)}/>
                                    <Image source={scannerbg} style={{width: 250, height: 350}}/>
                                    <Icon name={"rotate-left"} size={50} color={Colors.colorPrincipal} type='material-community'
                                          onPress={() => this.ws.turn_bed_CW_trigger(this.state.angle)}/>
                                </View>

                                <View style={{alignItems: 'center'}}>
                                    <Input
                                        label='Angle de rotation'
                                        inputContainerStyle={styleControl.input_container}
                                        containerStyle={{width: "90%",  margin: 10}}
                                        onChangeText={angle => this.setState({ angle: angle })}
                                        labelProps={{style: styleControl.input_label}}
                                        value={this.state.angle}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>

                    <Overlay
                        isVisible={this.state.modalView}
                        width={'98%'}
                        overlayBackgroundColor={'#fff'}
                        windowBackgroundColor={'#00000088'}
                        onBackdropPress={() => this.setState({ modalView: false })}
                    >
                        <Image source={{uri: "data:image/jpg;base64, " + this.props.stateConnection}} style={{width: '100%', height: '90%'}}/>
                        <Button
                            containerStyle={{width: '80%', alignSelf: 'center'}}
                            buttonStyle={{backgroundColor: Colors.colorPrincipal}}
                            title="camera preview"
                        />
                    </Overlay>
                </View>

        );
    }

}

export const styleControl = StyleSheet.create({
    container : {
        flex: 1,
    },
    containerControl: {
        flex:1,
        flexDirection: 'column'
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

export default connect(mapStateToProps)(controlScreen)