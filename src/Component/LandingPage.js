import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import data from '../data'
import { AuthContext } from '../Context/auth'

function LandingPage() {
  const navigate = useNavigate()
  // const { user, setUser, logOut} = useContext(AuthContext)
  const { user } = useContext(AuthContext)
  const [ clicked, setClicked ] = useState(true)
  const [ isRegister, setIsRegister ] = useState({
    fullName: "",
    bizName: "",
    email: "",
    password:""
  })
  const [isSigneIn, setIsSigneIn] = useState({
    email: "",
    password: ""
  }) 

  // const me = useContext(AuthProvider)
 const onRegister = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setIsRegister({
    ...isRegister, [name] : value,
  })
 }

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setIsSigneIn({
      ...isSigneIn, [name] : value,
    })   
  }

  const isRegiterHandler = (e) => {
    e.preventDefault()
    if(isRegister.fullName !== "" && isRegister.bizName !== "" && isRegister.email !== "" && isRegister.password !== ""){
      setIsRegister({
        fullName: isRegister.fullName,
        bizName: isRegister.bizName,
        email: isRegister.email,
        password:isRegister.password
      })
      console.log(isRegister)
      setIsRegister({
        fullName: "",
        bizName: "",
        email: "",
        password:""
       })
    } else {
     alert("Please register Now, Or 😡😡😠😡😡")
     setIsRegister({
      fullName: "",
      bizName: "",
      email: "",
      password:""
     })
    }
  }
  const isSignInHandler = (e) => {
    e.preventDefault()
      if (user.email === isSigneIn.email  && user.password === isSigneIn.password){
          navigate('dashboard')
    } else {
      // navigate('/')
      alert("respect yourself oh, Nkakwu 😂😂😂")
      setClicked(false)
      setIsRegister({
        fullName: "",
        bizName: "",
        email: "",
        password:""
      })
    }
    setIsSigneIn({
      email: "",
      password: ""
    })
  }



  return (
    <div>
      <div className='float-left w-1/2 h-screen grid items-center justify-items-center'>
          <div className='absolute top-32 w-64 left-10 md:top-56 md:left-72'>
            <span className='text-4xl font-bold'>Welcome Back</span>
            <p className='relative left-8'>Enter Your Details Below</p>
          </div>
          { clicked?
          <>
          <form className='relative p-2 w-96 top-20 md:top-36 md:left-16 ' onSubmit={isSignInHandler}>
            <input type='email' placeholder='Email Address' className='input'name="email" value={isSigneIn.email} onChange={onChange}/>
            <input type='password' placeholder='Password' className='input' name="password"  value={isSigneIn.password} onChange={onChange}/>
            <button type='submit' className='btn' >Sign In</button>
          </form>
          <div className='relative -top-32 text-sm flex'>Don't have an A<p className='text-white md:text-black'>ccount? </p><span onClick={() => setClicked(false)} className='cursor-pointer text-white md:text-primary-200'>Register</span></div>
          </> :
          <>
          <form className='absolute md:relative top-44 md:top-44 p-2 left-16 w-96' onSubmit={isRegiterHandler}>
            <input type='text' placeholder='Full Name' className='input' name='fullName' value={isRegister.fullName} onChange={onRegister}/>
            <input type='text' placeholder='Business Name' className='input' name='bizName' value={isRegister.bizName} onChange={onRegister}/>
            <input type='email' placeholder='Email Address' className='input' name='email' value={isRegister.email} onChange={onRegister}/>
            <input type='password' placeholder='Password' className='input' name='password' value={isRegister.password} onChange={onRegister}/>
            <button type='submit' className='btn'>Register</button>
          </form>
          <div className='relative top-60 left-24 md:top-0 md:left-4 text-sm'>Already have an Account? <span onClick={() => setClicked(true)} className='cursor-pointer text-white md:text-primary-200'>Sign In</span></div>
          </>}
      </div>

      <div className="float-right bg-primary-100 border-2 rounded-l-sm  w-1/2 h-screen grid items-center justify-items-center">
      <div className='absolute font-ms text-primary-100 text-9xl font-black flex top-1 left-1  md:relative md:text-white'>
         J <div className='text-8xl block -left-3 top-3 relative'>kl<span className='text-2xl relative -top-5 left-1 block'>stores</span></div>
      </div>
    </div>
    </div>
  )
}

export default LandingPage
