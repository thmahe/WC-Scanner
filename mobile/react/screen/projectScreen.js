import React from "react";
import {StyleSheet, View, FlatList, Text, ImageBackground} from "react-native";
import {Divider, Header, Icon, SearchBar} from "react-native-elements";
import Colors from "../assets/color/Colors";
import projectJson from "../devEnv/dev_data/projectJson";
import {connect} from "react-redux";
import websocketUtil from "../utils/websocket";

const mapStateToProps = (state) => {
    return {
        stateConnection : state.listProject,
    }
};

class projectScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            projectList: this.props.stateConnection,
            valueSearch: ''
        };
        this.arrayholder = this.props.stateConnection;
        this.ws = this.props.screenProps.ws;
    }

    renderItemProjectList(project){
        const imageBackgroundUri = require('../devEnv/dev_data/assets/white-noise.jpg');
        return(
            <View style={styleProject.projectItemContainer}>
                <ImageBackground source={imageBackgroundUri} style={styleProject.projectItemImageBackground} imageStyle={styleProject.projectItemImageBackground}>
                    <View style={{backgroundColor: "#00000099", alignItems: 'center', justifyContent: 'center', height: 30,
                        borderTopRightRadius: 15, borderTopLeftRadius: 15}}>
                        <Text style={{fontSize: 25, color: '#fff'}}> {project.name} </Text>
                    </View>

                    <View style={{height: 160}}/>

                    <View style={{backgroundColor: "#00000099", flexDirection: 'row', alignItems: 'center', height: 60,
                        borderBottomRightRadius: 15, borderBottomLeftRadius: 15}}>
                        <View style={{height: '100%', width: '90%', paddingLeft: 15}}>
                            <Text style={{fontSize: 18, color: '#fff'}}> {project.description} </Text>
                        </View>
                        <View>
                            <Icon name={'ios-arrow-forward'} size={30} color={Colors.colorPrincipal} type='ionicon'
                            onPress={() => this.props.navigation.navigate('ProjectDetail', {data: project} )}/>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    renderHeaderProjectList(){
        return(
            <View>
                <SearchBar
                    placeholder="Nom du projet ..."
                    lightTheme
                    round
                    onChangeText={text => this.searchFilterFunction(text)}

                    autoCorrect={false}
                    containerStyle={{backgroundColor: '#fff'}}
                    value={this.state.valueSearch}
                />
            </View>
        )
    }

    searchFilterFunction = text => {
        this.setState({valueSearch: text});
        const newData = this.arrayholder.filter(item => {
            const itemData = item.name;
            const textData = text;
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ projectList: newData });
    };

    render(){
        return(
            <View style={styleProject.container}>
                <Header
                    centerComponent={{text: 'Projet', style: {color: '#fff', fontSize: 25, fontWeight: '700'}}}
                    backgroundColor={Colors.colorPrincipal}
                    rightComponent={<Icon name={"plus"} size={25} color={'#fff'} type='font-awesome'
                                          onPress={() => this.props.navigation.navigate('NewProject', {ws: this.ws} )}/>}
                />
                <View style={styleProject.body}>
                    <FlatList
                        data={this.props.stateConnection}
                        renderItem={({item}) => this.renderItemProjectList(item)}
                        ItemSeparatorComponent={() => <Divider style={styleProject.projectSeparatorItem} />}
                        ListHeaderComponent={() => this.renderHeaderProjectList()}
                        ListHeaderComponentStyle={styleProject.projectHeaderComponent}
                        keyExtractor={item => item.name}  />
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
        width: '100%',
        flexDirection: 'row',
    },
    projectSeparatorItem: {
        backgroundColor: Colors.colorPrincipal,
        width: '90%',
        height: 2,
        borderRadius: 15,
        marginVertical: 5,
        alignSelf: 'center'
    },
    projectHeaderComponent: {
      marginBottom: 5,
    },
    projectItemContainer: {
        width: '98%',
        height: 250,
        flexDirection: 'column',
        borderRadius: 15,
        borderColor: Colors.grayColor,
        borderWidth: 1,
        alignSelf: 'center'
    },
    projectItemImageBackground: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    }
});

export default connect(mapStateToProps)(projectScreen)