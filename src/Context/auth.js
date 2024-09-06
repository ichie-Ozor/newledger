import { createContext, useContext, useState } from 'react'


// import clients from '../data'
// export const AuthContext = createContext(null)

// export const AuthProvider = ({children}) => {
//     const [category, setCategory ] = useState("hello")
//     const [user, setUser] = useState({
//         "email" : "example@mail.com",
//         "password": "123456789"
//         })


//     const logOut = () => {
//         setUser(null)
//     }
//     return <AuthContext.Provider value={{ user, setUser, logOut, clients, category, setCategory}}>
//                {children}
//            </AuthContext.Provider>
// }

const AuthContext = createContext(null)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = (assessToken) => {
        setUser(assessToken)
        // localStorage.setItem("user", assessToken.token)
        return assessToken
    }
    const isAutheticated = () => {
        if (user) {
            return true
        } else {
            return false
        }
    }
    const logout = (userToken) => {
        return localStorage.removeItem(userToken)
    }
    const getUserDetail = (userToken) => {
        return localStorage.getItem(userToken)
    }
    return <AuthContext.Provider value={{ user, isAutheticated, setUser, login, logout, getUserDetail }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}