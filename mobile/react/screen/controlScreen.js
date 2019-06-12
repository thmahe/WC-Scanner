import React from 'react';
import {StyleSheet, View, Image, Text} from "react-native";
import {Button, Header, Icon, Input, Overlay} from "react-native-elements";
import Colors from "../assets/color/Colors";
import websocketUtil from "../utils/websocket";


export default class controlScreen extends React.Component{

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
        const img_noise = require('../devEnv/dev_data/assets/white-noise.jpg');
        return(
            <View style={styleControl.container}>
                <Header
                    centerComponent={{text: 'Controle', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    rightComponent={<Icon name={"video-camera"} size={25} color={'#fff'} type='font-awesome'
                                          onPress={() => {this.setState({modalView: true})}}/>}
                />

                <View style={styleControl.containerControl}>
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
                </View>
                <Overlay
                    isVisible={this.state.modalView}
                    width={'98%'}
                    overlayBackgroundColor={'#fff'}
                    windowBackgroundColor={'#00000088'}
                    onBackdropPress={() => this.setState({ modalView: false })}
                >
                    <Image source={img_noise} style={{width: '100%', height: '90%'}}/>
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
        width: '100%',
        height: 400,
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