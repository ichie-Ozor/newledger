import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'



function Header({name, pageTitle}) {
  const auth = useAuth()
  const id = auth.user._id
  const adminUrl = `http://localhost:8080/profile/${id}`
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(true)
  const [ open, setOpen ] = useState(false)
  const [profile, setProfile ] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    adminPassword: ""
  })


useEffect(() => {
  axios.get(adminUrl).then((response) => {
    setAdmin(() => response.data.getProfile[0])
  }).catch(error => {
    console.log(error.message)
  })
})

  const onChange = (e) => {
     e.preventDefault()
     const {name, value} = e.target
     setProfile({
      ...profile, [name] : value
     })
  }

  const profileHandler = (e) => {
    e.preventDefault()
    console.log(profile)
    setProfile({
      firstName: "",
      lastName: "",
      businessName: "",
      adminPassword: ""
    })
    setOpen(!open)
  }
//const profileName = profile.fName + " " + profile.lName
//console.log(profileName, profile.bName)

  const openProfile = () => {
     if(open === false){
      setOpen(true)
     } else setOpen(false)
  }


  return (
    <div className='bg-primary-200 h-36 w-[100vw] flex'>
      <NavLink to='dashboard'><div className='left-4 text-gray-600 relative top-36 text-lg md:text-gray-400 md:left-56 md:top-14 md:text-3xl font-bold no-underline' onClick={() => navigate(-1)}>Welcome{pageTitle}</div></NavLink>
      <div className='header-profile flex absolute md:bg-primary-500 w-96 h-28 top-4 rounded-l-ksm'>
        <div className='header-img bg-gray-400  left-10 relative'>
          <img src='' alt='' />
        </div>
        <div className='header-name relative -left-80 text-lg font-bold text-black top-16 md:text-white md:text-xl md:w-40 md:left-14 md:top-5'>{name}</div>
        <svg onClick={openProfile} className='-left-40 top-1 text-white w-10 h-10 relative font-bold  cursor-pointer md:left-32 md:top-8' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {open ?
         
          (admin.lenght !== 0 ?
           <div 
             className='relative -left-96 top-36 bg-gray-100 p-4 z-10 w-96 h-46 pt-10  grid justify-items-center text-2xl font-bold rounded-xl shadow-xl md:top-32 md:left-[43rem] md:bg-white hover:shadow-md'>
              The Admin is already registered 😃😃😃
            </div> 
           :
                <div className='relative -left-96 top-36 bg-gray-100 z-10 w-96 h-96  grid justify-items-center rounded-xl shadow-xl md:top-32 md:left-[43rem] md:bg-white hover:shadow-md'>
                  <h3 className='text-xl text-gray-400 relative top-2'>Update your Profile</h3>
                  <form onSubmit={profileHandler}>
                    <input type='text' placeholder='Enter First Name' className='header-input' name='firstName' value={profile.firstName} onChange={onChange}/>
                    <input type='text' placeholder='Enter Last Name' className='header-input' name='lastName' value={profile.lastName} onChange={onChange}/>
                    <input type='text' placeholder='Enter Business Name' className='header-input' name='businessName' value={profile.businessName} onChange={onChange}/>
                    <input type='password' placeholder='Password' className='header-input' name='adminPassword' value={profile.adminPassword} onChange={onChange}/>
                    <button type='submit' className='w-24 h-10 rounded relative left-36 top-1 text-white text-xl bg-gray-400 hover:bg-red-300 hover:text-blue-100'>Submit</button>
                  </form>
                </div>)
              
        : <div></div>
      }
    </div>
  )
}

export default Header
