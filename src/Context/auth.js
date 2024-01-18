import { createContext, useState } from 'react'
import clients from '../data'
export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [category, setCategory ] = useState("hello")
    const [user, setUser] = useState({
        "email" : "example@mail.com",
        "password": "123456789"
        })
    

    const logOut = () => {
        setUser(null)
    }
    return <AuthContext.Provider value={{ user, setUser, logOut, clients, category, setCategory}}>
               {children}
           </AuthContext.Provider>
}