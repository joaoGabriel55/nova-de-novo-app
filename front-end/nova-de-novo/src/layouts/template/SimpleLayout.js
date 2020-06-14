import React from 'react';

function SimpleLayout(props) {
    const { children } = props;
    return (
        <>
            {children}
        </>
    );
}

export default SimpleLayout;