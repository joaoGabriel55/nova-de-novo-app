import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { AuthContext } from './auth/context/AuthContextProvider';

import RouteWithLayout from './components/RouterWithLayout';
import Main from './layouts/template/Main';

import SignIn from './auth/views/SignIn'

import { getUserByUsername } from './services/UserService'

import {
    Dashboard,
    ServiceOrder,
    ProductionMap,
    Customers,
    Dressmakers,
    Finances
} from './views'

const SignInRouter = () => {
    return (
        <>
            <Redirect
                exact
                from="/"
                to="/sign-in"
            />
            <RouteWithLayout
                component={SignIn}
                exact
                layout={Main}
                path="/sign-in"
            />
        </>
    )
}

const Routes = () => {
    const [userLogged, setUserLogged] = React.useContext(AuthContext);
    console.log(window.location.href.includes('sign-in'))
    async function userTokenValidation() {

        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const userToken = JSON.parse(jsonPayload)
                const user = await getUserByUsername(userToken.username)

                if (!userLogged)
                    setUserLogged({ username: user.username })

                return true
            } catch (error) {
                return false
            }
        }
    }

    if (!userTokenValidation())
        return (
            <Switch>
                {SignInRouter()}
            </Switch>
        )

    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/sign-in"
            />
            <RouteWithLayout
                component={SignIn}
                exact
                layout={Main}
                path="/sign-in"
            />
            <RouteWithLayout
                component={Dashboard}
                exact
                layout={Main}
                path="/home"
            />
            <RouteWithLayout
                component={ServiceOrder}
                exact
                layout={Main}
                path="/ordem-de-servico"
            />
            <RouteWithLayout
                component={ProductionMap}
                exact
                layout={Main}
                path="/mapa-de-producao"
            />
            <RouteWithLayout
                component={Customers}
                exact
                layout={Main}
                path="/clientes"
            />
            <RouteWithLayout
                component={Dressmakers}
                exact
                layout={Main}
                path="/costureiras"
            />
            <RouteWithLayout
                component={Finances}
                exact
                layout={Main}
                path="/financas"
            />
        </Switch>
    )
}

export default Routes;