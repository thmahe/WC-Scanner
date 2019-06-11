import React from 'react';
import {StyleSheet, View, Image} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import Colors from "../assets/color/Colors";
import websocketUtil from "../utils/websocket";
export default class controlScreen extends React.Component{

    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'remote';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : Colors.grayColor} type='material-community'/>;
        },
    };

    constructor(){
        super();
        this.ws = new websocketUtil;
    }

    render(){
        const scannerbg = require('../assets/scanner_bg.png');
        return(
            <View style={styleControl.container}>
                <Header
                    centerComponent={{text: 'Controle', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    rightComponent={<Icon name={"video-camera"} size={25} color={'#fff'} type='font-awesome'/>}
                />

                <View style={styleControl.containerControl}>
                    <Button
                        title="left"
                        type="outline"
                        onPress={() => this.ws.turn_bed_CCW_trigger(60)}
                    />

                    <Button
                        title="right"
                        type="outline"
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
    }
});