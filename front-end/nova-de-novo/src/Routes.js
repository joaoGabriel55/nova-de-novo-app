import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import RouteWithLayout from './components/RouterWithLayout';
import Main from './layouts/template/Main';
import {
    Dashboard,
    ServiceOrder,
    ProductionMap,
    Customers,
    Dressmakers,
    Finances
} from './views'

const Routes = () => {
    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/home"
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