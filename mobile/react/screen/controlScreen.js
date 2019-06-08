import React from 'react';
import {StyleSheet, View, Text} from "react-native";
import {Icon} from "react-native-elements";
import Colors from "../assets/color/Colors";
export default class controlScreen extends React.Component{

    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'gamepad';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : Colors.grayColor} type='material-community'/>;
        },
    };

    constructor(){
        super();
    }

    render(){
        return(
            <View style={styleControl.container}>

            </View>
        );
    }

}

export const styleControl = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});