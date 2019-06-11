
import {
    createAppContainer,
    createBottomTabNavigator,
    createStackNavigator,
    createSwitchNavigator
} from "react-navigation";
import projectScreen from "../projectScreen";
import homeScreen from "../homeScreen";
import controlScreen from "../controlScreen";
import Colors from "../../assets/color/Colors";
import NewProjectScreen from "../NewProjectScreen";
import ProjectNavigation from "./ProjectNavigation";

const BottomNavigation = createBottomTabNavigator({
    HomeScreen:{screen: homeScreen},
    ProjectScreen:{screen: ProjectNavigation},
    ControlScreen:{screen: controlScreen},
},{
    initialRouteName: "HomeScreen",
    animationEnabled: true,
    tabBarOptions:{
        labelStyle: {
            color: "#000"
        },
        showLabel: false,
        style: {
            backgroundColor: Colors.colorPrincipal,
        },
    }
});

const NavigationStack = createStackNavigator(
    {
        Base: BottomNavigation,


    },
    {initialRouteName: 'Base', headerMode: 'true', defaultNavigationOptions:{
            gesturesEnabled: true
        }}
);

const SwitchAppNavigator = createSwitchNavigator(
    {App: NavigationStack},
    {initialRouteName: 'App', headerMode: 'true'});

export default createAppContainer(SwitchAppNavigator);