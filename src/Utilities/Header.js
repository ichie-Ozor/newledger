import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/auth'
import { baseUrl } from './helper'
import { toast } from 'react-toastify'



function Header({ name, pageTitle, classStyle }) {
  const auth = useAuth()
  const location = useLocation()
  console.log(location, "location")
  const id = auth.user._id
  const adminUrl = baseUrl + "/profile/"
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    businessName: "",
    password: "",
    file: null
  })


  useEffect(() => {
    axios.get(adminUrl + `/${id}`).then((response) => {
      setAdmin(response.data.getProfile)
      console.log(response, "response")
      // setAdmin(() => response.data.getProfile[0])
    }).catch(error => {
      console.log(error.message)
    })
  }, [adminUrl, id])

  const onChange = (e) => {
    e.preventDefault()

    const { name, value, files } = e.target
    if (name === "file") {
      setProfile((prev) => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setProfile({
        ...profile, [name]: value,
        account: id
      })
    }
  }

  const profileHandler = (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("address", profile.address);
    formData.append("businessName", profile.businessName);
    formData.append("password", profile.password);
    formData.append("file", profile.file);
    formData.append("account", id);


    axios.post(adminUrl, formData)
      .then((response) => {
        console.log(response)
        toast.success("Your Profile has being created successfully!")
      }).catch(err => {
        console.error('Error has occured at profile, header page', err)
        toast.error("Error has occured while trying to create the profile")
      })

    setProfile({
      name: "",
      address: "",
      businessName: "",
      password: "",
      file: null
    })
    setOpen(!open)
    // window.location.reload()

  }

  const openProfile = () => {
    if (open === false) {
      setOpen(true)
    } else setOpen(false)
  }


  return (
    <div className='bg-primary-200 h-[12vh] md:h-[20vh]  w-[100vw] md:w-[85vw] flex justify-between items-center md:ml-[15vw] pr-0'>
      <NavLink to='dashboard' className='no-underline'><div className='text-gray-600 text-2xl md:text-gray-400 md:text-3xl font-bold m-4' onClick={() => navigate(-1)}>Welcome{pageTitle}</div></NavLink>
      {/* <div className='absolute text-white top-28 ml-5 block md:none' onClick={() => navigate(-1)}>BACK</div> */}
      <div className=' md:w-auto md:flex md:bg-primary-500 h-28 rounded-l-ksm ml-auto md:items-center'>
        <div className='header-img bg-gray-400 relative'>
        </div>
        <div className='md:relative text-base font-bold text-white md:text-xl md:w-40 md:left-14 md:top-5'>{name}</div>
        <svg onClick={openProfile} className='text-white w-10 h-10 font-bold ml-auto mr-4 cursor-pointer' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {open ?

        (admin.length > 0 ?
          <div
            className='relative -left-40 top-20 bg-gray-100 p-1 md:p-4 z-10 w-[20rem] md:w-96 h-[5rem] md:h-46 grid justify-items-center text-xl md:text-2xl font-bold rounded-xl shadow-xl md:top-32 md:left-[43rem] md:bg-white hover:shadow-md'>
            The Admin is already registered 😃😃😃
          </div>
          :
          <div className='relative -left-[11rem] top-20 bg-gray-100 z-10 w-96 h-96  grid justify-items-center rounded-xl shadow-xl md:top-32 md:left-[43rem] md:bg-white hover:shadow-md'>
            <h3 className='text-xl text-gray-400 relative top-2'>Update your Profile</h3>
            <form onSubmit={profileHandler} className='flex flex-col px-5' enctype="multipart/form-data">
              <input type='text' placeholder='Enter Name' className='w-full border-1 border-gray-300 h-10 mb-2 rounded p-2 shadow-xl hover:shadow text-gray-600' name='name' value={profile.name} onChange={onChange} />
              <input type='text' placeholder='Enter Business Address' className='w-full border-1 border-gray-300 h-10 mb-2 rounded p-2 shadow-xl hover:shadow text-gray-600' name='address' value={profile.address} onChange={onChange} />
              <input type='text' placeholder='Enter Business Name' className='w-full border-1 border-gray-300 h-10 mb-2 rounded p-2 shadow-xl hover:shadow text-gray-600' name='businessName' value={profile.businessName} onChange={onChange} />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='w-full border-1 border-gray-300 h-10 mb-2 rounded p-2 shadow-xl hover:shadow text-gray-600' name='password' value={profile.password} onChange={onChange} />
                <button
                  type="button"
                  className="absolute inset-y-0 rounded-r border-0 right-0 px-5 pt-2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg"
                      height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#5f6368">
                      <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                  )}
                </button>
              </div>
              <input type='file' placeholder='Enter business logo here' className='w-full border-1 border-gray-300 h-12 mb-2 rounded p-1 shadow-xl hover:shadow text-gray-600' name='file' accept='image/*, .pdf, .doc, .docx' onChange={onChange} />
              <button type='submit' className='w-24 h-10 rounded text-white text-xl bg-gray-400 hover:bg-red-300 hover:text-blue-100'>Submit</button>
            </form>
          </div>)
        : <div></div>
      }
    </div>
  )
}

export default Header
