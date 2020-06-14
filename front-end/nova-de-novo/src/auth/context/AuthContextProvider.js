import React, { useState, createContext } from "react";

// Create Context Object
export const AuthContext = createContext()

// Create a provider for components to consume and subscribe to changes
export const AuthContextProvider = props => {
    const [userLogged, setUserLogged] = useState(null)

    return (
        <AuthContext.Provider value={[userLogged, setUserLogged]}>
            {props.children}
        </AuthContext.Provider>
    );
};