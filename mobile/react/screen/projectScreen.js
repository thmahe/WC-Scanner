import React from "react";
import {StyleSheet, View, FlatList} from "react-native";
import {Header, Icon} from "react-native-elements";
import Colors from "../assets/color/Colors";

export default class homeScreen extends React.Component{

    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'folder';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : '#dddddd'} type='font-awesome'/>;
        },
    };


    constructor(){
        super();
    }

    render(){
        return(
            <View style={styleProject.container}>
                <Header
                    centerComponent={{text: 'Project', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    rightComponent={<Icon name={"plus"} size={25} color={'#fff'} type='font-awesome'/>}
                />
                <View style={styleProject.body}>

                </View>
            </View>
        );
    }
}

export const styleProject = StyleSheet.create({
    container : {
        flex: 1,
    },
    body: {
        flex:1,
        backgroundColor: '#12AEFC'
    }
});