import React from "react";
import { Switch, Route } from 'react-router-dom'
import HomeScreen from "./HomeScreen";
import LoadProjectScreen from "./LoadProjectScreen";
import NewProjectScreen from "./NewProjectScreen";

const Main = () => (
    <main style={{display: 'flex', height: '100%'}}>
        <Switch>
            <Route exact path='/' component={HomeScreen}/>
            <Route path='/loadProject' component={LoadProjectScreen}/>
            <Route path='/newProject' component={NewProjectScreen}/>
        </Switch>

    </main>
);

export default Main;