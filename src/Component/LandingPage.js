import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'
import axios from 'axios'

function LandingPage() {
  const navigate = useNavigate()
  const [errorText, setErrorText] = useState("")
  const auth = useAuth()   //this is imported from the context soas to distribute it to all the components that needs it
  const [clicked, setClicked] = useState('1')
  const [verifyEmail, setVerifyEmail] = useState("")
  const [forget, setForget] = useState({
    email: "",
    password: ""
  })
  const [isRegister, setIsRegister] = useState({
    fullName: "",
    businessName: "",
    phoneNumber: "",
    email: "",
    password: ""
  })
  const [isSigneIn, setIsSigneIn] = useState({
    email: "",
    password: ""
  })


  ////////////////Registration begins here
  const onRegister = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setIsRegister({
      ...isRegister, [name]: value,
    })
  }

  const isRegiterHandler = (e) => {
    e.preventDefault()
    if (isRegister.fullName !== "" && isRegister.businessName !== "" && isRegister.email !== "" && isRegister.password !== "") {
      setIsRegister({
        fullName: isRegister.fullName,
        businessName: isRegister.businessName,
        phoneNumber: isRegister.phoneNumber,
        email: isRegister.email,
        password: isRegister.password
      })
      console.log(isRegister)    //send this to the backend
      const baseUrl3 = 'http://localhost:8080/account/signup'
      axios.post(baseUrl3, isRegister)
        .then((response) => {
          console.log(response)
          if (response.data.status === "Failed") {
            setVerifyEmail(response.data.message)
          }
          if (response.data.status === "Success") {
            // setVerifyEmail("Please verify your email to continue")
            ////////this should take you to the payment page
            navigate('/payment')
          }
        })
        .catch(error => setErrorText(error))

      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
        email: "",
        password: ""
      })

    } else {
      setErrorText("Please register Now, Or 😡😡😠😡😡")
      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
        email: "",
        password: ""
      })
    }
  }

  //////////////////Signin and fetch signup details from the backend
  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setIsSigneIn({
      ...isSigneIn, [name]: value,
    })
  }
  // const baseUrl = `http://localhost:8080/auth/getaccount/${isSigneIn.email}$${isSigneIn.password}`   //the detail ofthe client with that email//this url is used to get 
  const baseUrl = "http://localhost:8080/auth/signin"

  const isSignInHandler = (e) => {
    e.preventDefault()
    const { email, password } = isSigneIn
    if (email === "" && password === "") {
      return setErrorText("Please register Now, Or 😡😡😠😡😡")
    }
    // console.log(isSigneIn)
    /////////////////this sends data to the back for signin 
    axios({
      method: 'post',
      url: baseUrl,
      data: { email, password }
    }).then((response) => {
      const status = response.data.status
      const code = response.data.code
      console.log(response, "signin")
      const { assessToken, userDetail } = response.data
      // const userDetails = {email, response, assessToken, refreshToken, userDetail}

      // if verification is false and approval > 30 redirect to payment page
      if (code === 900 || code === 901) {
        const user = {
          token: response.data.assessToken,
          userDetail: response.data.userDetail
        }
        auth.login(user)
        navigate('/payment')
        // window.location.reload()
      }

      if (code === 402 || code === 401) {
        setErrorText("Please register 😂😂😂")
        setClicked(false)
        setIsRegister({
          fullName: "",
          businessName: "",
          phoneNumber: "",
          email: "",
          password: ""
        })
      }
      if (response.data.role === "admin") {
        navigate('/admin')
        // window.location.reload()
      }
      if (status === "Success" || code === 200) {
        const user = {
          token: response.data.assessToken,
          userDetail: response.data.userDetail
        }
        auth.login(response.data.userDetail)      //this is supposed to update the state in the context so that it can be available to all the components that needs to extract the details of the user from the backend
        localStorage.setItem("myToken", user.token)
        navigate('/dashboard')
        // window.location.reload()
      }
    }).catch(error => {
      console.log(error)
      setErrorText(error, "This name does not exist, please register")
      setClicked(false)
      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
        email: "",
        password: ""
      })
    })

    setIsSigneIn({
      email: "",
      password: ""
    })
  }

  ////////////////Forget Passsword
  const onForget = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setForget({
      ...forget, [name]: value
    })
  }

  const forgetHandler = (e) => {
    e.preventDefault()
    if (forget.email === "" && forget.password === "") {
      return setErrorText("Please register Now, Or 😡😡😠😡😡")
    }
    const forgetUrl = `http://localhost:8080/account/${forget.email}`
    axios({
      method: 'POST',
      url: forgetUrl,
      data: { password: forget.password }
    }).then((response) => {
      console.log(response)
    })
  }

  return (
    <div>
      <div className='relative float-left flex w-1/2 h-screen top-10 items-center justify-center'>
        <div className='absolute pl-10 md:pl-0 top-32 w-64 md:top-[3rem]'>
          <span className='text-xl md:text-4xl font-bold'>Welcome Back</span>
          <p className='relative md:left-8'>Enter Your Details Below</p>
        </div>
        <div className={clicked === "1" ? 'signIn' : clicked === "2" ? 'register' : "forgetP"}>{errorText}</div>
        <div>{verifyEmail}</div>
        {clicked === '1' ?
          <div className='flex flex-col justify-center items-center'>
            <div className='relative top-20 left-20 md:-top-24 md:-left-5 font-bold text-3xl md:text-lg'>Sign In</div>
            <form className='relative p-20 md:p-2 w-96 top-5 md:-top-28' onSubmit={isSignInHandler}>
              <input type='email' placeholder='Email Address' className='input relative left-12 md:left-0' name="email" value={isSigneIn.email} onChange={onChange} />
              <input type='password' placeholder='Password' className='input relative left-12 md:left-0' name="password" value={isSigneIn.password} onChange={onChange} />
              <button type='submit' className='btnz' >Sign In</button>
            </form>
            <div className='relative flex flex-col justify-center items-center left-12 md:-top-20 md:-left-6'>
              <div className='relative -top-5  text-sm flex'>Don't have an A<p className='text-black'>ccount? </p><span onClick={() => setClicked('2')} className='cursor-pointer text-blue-700 md:text-primary-200'>Register</span></div>
              <span className='absolute text-sm text-primary-200 cursor-pointer' onClick={() => setClicked('3')}>forgot Password?</span>
            </div>
          </div> :
          clicked === '2' ?
            <div className='flex flex-col justify-center items-center'>
              <div className='relative top-[-10rem] md:top-5 left-32 md:-left-5 font-bold text-xl md:text-lg'>Registeration</div>
              <form className='absolute md:relative top-40 md:top-0 p-2  w-[50%]' onSubmit={isRegiterHandler}>
                <input type='text' placeholder='Full Name' className='input' name='fullName' value={isRegister.fullName} onChange={onRegister} />
                <input type='text' placeholder='Business Name' className='input' name='businessName' value={isRegister.businessName} onChange={onRegister} />
                <input type='text' placeholder='Phone Number' className='input' name='phoneNumber' value={isRegister.phoneNumber} onChange={onRegister} />
                <input type='email' placeholder='Email Address' className='input' name='email' value={isRegister.email} onChange={onRegister} />
                <input type='password' placeholder='Password' className='input' name='password' value={isRegister.password} onChange={onRegister} />
                <button type='submit' className='btny'>Register</button>
              </form>
              <div className='relative flex flex-col justify-center items-center md:top-2 left-28 md:-left-6'>
                <div className='relative top-60 md:top-0 text-sm'>Already have an Account? <span onClick={() => setClicked('1')} className='cursor-pointer text-blue-600 md:text-primary-200'>Sign In</span></div>
                <span onClick={() => setClicked('3')} className='relative cursor-pointer text-sm text-blue top-[13.8rem] left-2 md:left-0 md:text-primary-200 md:top-0'>forgot Password?</span>
              </div>
            </div> :
            clicked === '3' ?

              <div className='flex flex-col justify-center items-center'>
                <div className='relative top-20 md:-top-24 left-16 md:-left-5 font-bold text-2xl md:text-lg'>Forget Password</div>
                <form className='relative p-20 md:p-2 w-96 top-5 md:-top-28' onSubmit={forgetHandler}>
                  <input type='email' placeholder='Email Address' className='input relative left-12 md:left-0' name="email" value={forget.email} onChange={onForget} />
                  <input type='password' placeholder='Password' className='input relative left-12 md:left-0' name="password" value={forget.password} onChange={onForget} />
                  <button type='submit' className='btnz' >Submit</button>
                </form>
                <div className='relative flex flex-col justify-center items-center left-12 md:-top-20 md:-left-6'>
                  <div className='relative -top-5  text-sm flex'>Don't have an A<p className='text-black'>ccount? </p><span onClick={() => setClicked('2')} className='cursor-pointer text-blue-700 md:text-primary-200'>Register</span></div>
                  <span className='absolute text-sm text-primary-200 cursor-pointer' onClick={() => setClicked('1')}>Sign in</span>
                </div>
              </div> :
              <></>}
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
