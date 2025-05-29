import { createContext, useContext, useState } from 'react'


////////////////SideBar
const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    return (
        <SideBarContext.Provider value={{ activeComponent, setActiveComponent }}>
            {children}
        </SideBarContext.Provider>
    )
}

export const useSideBar = () => useContext(SideBarContext)