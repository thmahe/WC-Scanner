import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";
import projectScreen from "../projectScreen";
import NewProjectScreen from "../NewProjectScreen";
import {Icon} from "react-native-elements";
import Colors from "../../assets/color/Colors";
import React from "react";
import projectDetail from "../projectDetail";

const NavigationStack = createStackNavigator(
    {
        ProjectScreen: projectScreen,
        NewProject: NewProjectScreen,
        ProjectDetail: projectDetail,
    },
    {initialRouteName: 'ProjectScreen', headerMode: 'none'}
);

const SwitchAppNavigator = createSwitchNavigator(
    {App: NavigationStack},
    {initialRouteName: 'App', headerMode: 'none'});


export default class ProjectNavigation extends React.Component{
    static navigationOptions = {
        tabBarIcon: ({ focused}) => {
            const iconName = 'folder';
            return <Icon name={iconName} size={focused ? 40 : 30} color={focused ? '#fff' : Colors.grayColor} type='font-awesome'/>;
        },
    };
    render() {
        return(
            <AppContainer screenProps={{ws: this.props.screenProps.ws}}/>
        )
    }

}

const AppContainer = createAppContainer(NavigationStack);