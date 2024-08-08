import { createContext, useContext, useState } from 'react'

const authContext = createContext({});

export const useAuthContext = () => {
    return useContext(authContext);
}

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return <authContext.Provider value={{ user, setUser }}>
        {children}
    </authContext.Provider>
}

export default AuthContextProvider;