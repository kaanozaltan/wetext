import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import "./components/style.scss"


const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login} exact></Route>
                <Route path="/register" component={Register} exact></Route>
                <Route path="/home" component={Home} exact></Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App;