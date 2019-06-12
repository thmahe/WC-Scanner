import React from "react";
import {StyleSheet, View, Text, Image, FlatList, ImageBackground} from "react-native";
import {Button, Divider, Header, Icon} from "react-native-elements";
import Colors from "../assets/color/Colors";

import { connect } from 'react-redux'
import websocketUtil from "../utils/websocket";

const mapStateToProps = (state) => {
    return {
        stateConnection : state.stateCo,
    }
};

class homeScreen extends React.Component{
    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'home';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : Colors.grayColor} type='font-awesome'/>;
        },
    };

    constructor(props){
        super(props);
        this.ws = new websocketUtil(props)
    }


    componentDidMount(): void {
        this.ws.get_connection_status();
    }

    render(){
        const icon256 = require('../assets/icons/png/256x256.png');
        return(
            <View style={styleHome.container}>
                <Header
                    centerComponent={{text: 'WC Scanner', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    rightComponent={<Icon name={"wifi"} size={25} color={this.props.stateConnection ? '#fff' : Colors.redColor} type='font-awesome'
                                          onPress={() => this.ws.get_connection_status}/>}
                />
                <View style={styleHome.body}>
                    <Text style={styleHome.body_text_h1}>Bienvenue sur WC-Scanner</Text>
                    <Image source={icon256}/>
                </View>
            </View>
        );
    }
}

export const styleHome = StyleSheet.create({
    container : {
        flex: 1,
    },
    body: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    body_text_h1: {
        fontSize: 25
    },
});

export default connect(mapStateToProps)(homeScreen)