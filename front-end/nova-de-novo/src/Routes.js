import React from 'react';

import { tokenDecoder } from './utils/TokenDecoder'

import { Switch, Redirect, useHistory } from 'react-router-dom';

import { AuthContext } from './auth/context/AuthContextProvider';

import RouteWithLayout from './components/RouterWithLayout';

import Main from './layouts/template/Main';

import SimpleLayout from './layouts/template/SimpleLayout'
import SignIn from './auth/views/SignIn'

import { getUserByUsername } from './services/UserService'

import {
    Dashboard,
    ServiceOrder,
    ProductionMap,
    Customers,
    Dressmakers,
    Users,
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
                layout={SimpleLayout}
                path="/sign-in"
            />
        </>
    )
}

const Routes = () => {
    const [userLogged, setUserLogged] = React.useContext(AuthContext);
    const history = useHistory()

    async function userTokenValidation() {

        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const userToken = tokenDecoder(token)
                const user = await getUserByUsername(userToken.username)

                if (!userLogged)
                    setUserLogged({ username: user.username })

                return true
            } catch (error) {
                return false
            }
        } else if (!localStorage.getItem('accessToken') && !localStorage.getItem('refreshToken')) {
            history.replace('/sign-in')
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
                layout={SimpleLayout}
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
                component={Users}
                exact
                layout={Main}
                path="/usuarios"
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