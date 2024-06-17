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
export const AuthProvider = ({children}) => {
   const [user, setUser ] = useState(null)

   const login = (assessToken) => {
    setUser(assessToken.userDetail)
    localStorage.setItem("user", assessToken.token)
    return assessToken
   }
   const logout = () => {
    return localStorage.removeItem("user")
   }
   const getUserDetail = (userDetail) => {
    return localStorage.getItem(userDetail)
   }
   return <AuthContext.Provider value={{user, login, logout, getUserDetail}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}