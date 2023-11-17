import { createContext, useState } from 'react'

export const AuthContext = createContext(null)




export const AuthProvider = ({children}) => {
    const [user, setUser] = useState({
        "email" : "example@mail.com",
        "password": "123456789"
        })
    


    // const login = () => {
    //     // const data = {
    //     //     "email" : "example@mail.com",
    //     //     "password": "123456789"
    //     //     }
    //     setUser(data)
    // }
    const logOut = () => {
        setUser(null)
    }
    return <AuthContext.Provider value={{ user, setUser, logOut}}>
               {children}
           </AuthContext.Provider>
}

// export const useAuth = () => {
//     return useContext(AuthContext)
// }