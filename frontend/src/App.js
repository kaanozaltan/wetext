import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import AuthController from './components/authController'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import "./components/style.scss"


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route
          path="/"
          component={(props) => (
            <AuthController {...props}>
              <Route path="/home" component={Home} exact />
            </AuthController>
          )}
        />
      </Switch>
    </BrowserRouter>
  )
}

export default App;