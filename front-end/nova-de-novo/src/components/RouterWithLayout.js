import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

function RouteWithLayout(props) {
    const { layout: Layout, component: Component, ...rest } = props;
    if (rest.computedMatch.params && rest.computedMatch.params.id)
        rest.path = `${rest.path}/${rest.computedMatch.params.id}`

    return (
        <Route
            {...rest}
            render={matchProps => (
                <Layout>
                    <Component {...matchProps} />
                </Layout>
            )}
        />
    );
};

RouteWithLayout.propTypes = {
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    path: PropTypes.string
};

export default RouteWithLayout;