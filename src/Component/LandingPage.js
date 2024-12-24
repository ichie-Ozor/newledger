import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth";
import { baseUrl } from "../Utilities/helper";
import axios from "axios";
import { toast } from "react-toastify";
import ledger from '../img/ledger.jpg'

function LandingPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("")
  const [forgetError, setForgetError] = useState("")
  const auth = useAuth(); //this is imported from the context soas to distribute it to all the components that needs it
  const [clicked, setClicked] = useState("1");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [forget, setForget] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState({
    fullName: "",
    businessName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
  });
  const [isSigneIn, setIsSigneIn] = useState({
    email: "",
    password: "",
  });

  ////////////////Registration begins here
  const onRegister = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setIsRegister({
      ...isRegister,
      [name]: value,
    });
  };

  const isRegisterHandler = (e) => {
    e.preventDefault();
    if (
      isRegister.fullName !== "" &&
      isRegister.businessName !== "" &&
      isRegister.email !== "" &&
      isRegister.password !== ""
    ) {
      setIsRegister({
        fullName: isRegister.fullName,
        businessName: isRegister.businessName,
        phoneNumber: isRegister.phoneNumber,
        address: isRegister.address,
        email: isRegister.email,
        password: isRegister.password,
      });
      const baseUrl3 = baseUrl + "/account/signup"
      axios
        .post(baseUrl3, isRegister)
        .then((response) => {
          if (response.data.status === "Failed") {
            // setVerifyEmail(response.data.message);
            setRegisterError(response.data.message)
          }
          if (response.data.status === "Success") {
            // setVerifyEmail("Please verify your email to continue")
            ////////this should take you to the payment page
            const user = {
              token: response.data.assessToken,
              userDetail: response.data.userDetail,
            };
            // auth.login(response.data.userDetail); //this is supposed to update the state in the context so that it can be available to all the components that needs to extract the details of the user from the backend
            localStorage.setItem("myToken", user.token);
            navigate("/payment");
          }
        })
        .catch((error) => setRegisterError(error));

      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
        address: "",
        email: "",
        password: "",
      });
    } else {
      setRegisterError("Please register Now 😡😡😠😡😡");
      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
        address: "",
        email: "",
        password: "",
      });
    }
  };

  //////////////////Signin and fetch signup details from the backend
  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setIsSigneIn({
      ...isSigneIn,
      [name]: value,
    });
  };
  // const baseUrly = baseUrl+`/auth/getaccount/${isSigneIn.email}$${isSigneIn.password}`   //the detail ofthe client with that email//this url is used to get
  const baseUrlxx = baseUrl + "/auth/signin";

  const isSignInHandler = (e) => {
    e.preventDefault();
    const { email, password } = isSigneIn;
    if (email === "" && password === "") {
      return setErrorText("Please register Now, Or 😡😡😠😡😡");
    }

    axios({
      method: "post",
      url: baseUrlxx,
      data: { email, password },
    })
      .then((response) => {
        const status = response.data.status;
        const role = response.data.userDetail?.role
        const code = response.data.code;
        console.log(role, "role", code)
        // const { assessToken, userDetail } = response.data;

        // if verification is false and approval > 30 redirect to payment page
        if (code === 900 || code === 901) {
          const user = {
            token: response.data.assessToken,
            userDetail: response.data.userDetail,
          };
          auth.login(user);
          navigate("/payment");
          // window.location.reload()
        }

        if (code === 402 || code === 401) {
          setErrorText("Please register 😂😂😂");
          setClicked("2");
          setIsRegister({
            fullName: "",
            businessName: "",
            phoneNumber: "",
            address: "",
            email: "",
            password: "",
          });
          setRegisterError(" Wrong sign In detials, please Register 😂😂😂")
        }
        if (status === "Success" && role === "admin") {
          const user = {
            token: response.data.assessToken,
            userDetail: response.data.userDetail,
          };
          auth.login(response.data.userDetail); //this is supposed to update the state in the context so that it can be available to all the components that needs to extract the details of the user from the backend
          localStorage.setItem("myToken", user.token);
          navigate("/admin");
        }
        if (status === "Success" && role === "user") {
          const user = {
            token: response.data.assessToken,
            userDetail: response.data.userDetail,
          };
          auth.login(response.data.userDetail); //this is supposed to update the state in the context so that it can be available to all the components that needs to extract the details of the user from the backend
          localStorage.setItem("myToken", user.token);
          navigate("/dashboard");
          // window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorText(error, "This name does not exist, please register");
        setClicked(false);
        setIsRegister({
          fullName: "",
          businessName: "",
          phoneNumber: "",
          address: "",
          email: "",
          password: "",
        });
      });

    setIsSigneIn({
      email: "",
      password: "",
    });
  };

  ////////////////Forget Passsword
  const onForget = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setForget({
      ...forget,
      [name]: value,
    });
  };

  const forgetHandler = (e) => {
    e.preventDefault();
    if (forget.email === "" && forget.password === "") {
      return setForgetError("Please register Now, Or 😡😡😠😡😡");
    }
    const forgetUrl = baseUrl + `/account/forgotPassword/${forget.email}`;
    axios({
      method: "POST",
      url: forgetUrl,
      data: { password: forget.password },
    }).then((response) => {
      toast.success(response.data.message || "You have successfully Changed your password, Congratulations!😍😍")
      console.log(response);
    }).catch((error) => {
      console.log(error)
      toast.error(error.response.data.message)
      setForget({
        email: "",
        password: ""
      })
    })
  };

  return (
    <div>
      <div className="relative float-left flex w-1/2 h-screen top-10 items-center justify-center">
        <div className="absolute pl-10 md:pl-0 top-32 w-64 md:top-[3rem]">
          <span className="text-xl md:text-4xl font-bold">Welcome Back</span>
          <p className="relative md:left-8">Enter Your Details Below</p>
        </div>
        {clicked === "1" ? (
          <>
            <div className={clicked === "1" ? "signIn" : setErrorText("")}>
              {errorText}
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen">
              <div className="relative top-10 md:top-6 lg:top-4 left-10 md:left-0 font-bold text-3xl md:text-2xl lg:text-3xl">
                Sign In
              </div>
              <form
                className="relative p-8 md:p-4 lg:p-8 w-[90%] max-w-md space-y-6 flex flex-col items-center justify-center"
                onSubmit={isSignInHandler}
                style={{ marginLeft: '0', marginRight: 'auto' }}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={isSigneIn.email}
                  onChange={onChange}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="password"
                    value={isSigneIn.password}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 rounded-r border-0 right-0 px-3 pt-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#5f6368">
                        <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                      </svg>
                      // <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                      // <Eye className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-blue-700 text-white w-[100px] h-[40px] rounded-md shadow-lg hover:bg-blue-600 relative left-10"
                >
                  Sign In
                </button>
              </form>
              <div className="relative flex flex-col justify-center items-center mt-4 space-y-4">
                <div className="text-sm flex font-semibold">
                  Don't have an Account?
                  <span
                    onClick={() => setClicked('2')}
                    className="cursor-pointer text-blue-700 ml-1 hover:text-blue-900"
                  >
                    Register
                  </span>
                </div>
                <span
                  className="text-sm text-blue-700 cursor-pointer hover:text-blue-900 font-semibold"
                  onClick={() => setClicked('3')}
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </>
        ) : clicked === "2" ? (
          <>
            <div
              className={clicked === "2" ? "register" : setRegisterError("")}
            >
              {registerError}
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen">
              <div className="relative top-[-5rem] md:top-0 lg:top-0 font-bold text-2xl md:text-xl lg:text-2xl">
                Registration
              </div>

              <form
                className="p-4 w-full max-w-[90%] md:max-w-[70%] lg:max-w-[40%] space-y-4 flex flex-col items-center justify-center"
                onSubmit={isRegisterHandler}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="fullName"
                  value={isRegister.fullName}
                  onChange={onRegister}
                />
                <input
                  type="text"
                  placeholder="Business Name"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="businessName"
                  value={isRegister.businessName}
                  onChange={onRegister}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="phoneNumber"
                  value={isRegister.phoneNumber}
                  onChange={onRegister}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="address"
                  value={isRegister.address}
                  onChange={onRegister}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={isRegister.email}
                  onChange={onRegister}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "test" : "password"}
                    placeholder="Password"
                    className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="password"
                    value={isRegister.password}
                    onChange={onRegister}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 rounded-r border-0 right-0 px-3 pt-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#5f6368">
                        <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                      </svg>
                      // <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                      // <Eye className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="btny bg-blue-800 text-white w-[90px] h-[40px] shadow-lg hover:bg-blue-700 rounded-md"
                >
                  Register
                </button>
              </form>

              <div className="flex flex-col justify-center items-center mt-10">
                <div className="text-center text-sm font-semibold">
                  Already have an Account?{" "}
                  <span
                    onClick={() => setClicked("1")}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    Sign In
                  </span>
                </div>
                <span
                  onClick={() => setClicked("3")}
                  className="text-center text-sm text-blue-600 hover:text-blue-800 font-semibold mt-4 cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </>
        ) : clicked === "3" ? (
          <>
            <div className={clicked === "3" ? "forgetP" : setForgetError("")}>
              {forgetError}
            </div>
            <div className="flex flex-col justify-center items-center min-h-screen">
              <div className="relative top-6 md:top-0 lg:top-0 font-bold text-2xl md:text-xl lg:text-2xl">
                Forget Password
              </div>
              <form
                className="p-4 md:p-8 lg:p-12 w-full max-w-[90%] md:max-w-[60%] lg:max-w-[40%] space-y-6 flex flex-col items-center justify-center"
                onSubmit={forgetHandler}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={forget.email}
                  onChange={onForget}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="password"
                    value={forget.password}
                    onChange={onForget}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 rounded-r border-0 right-0 px-3 pt-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#5f6368">
                        <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                      </svg>
                      // <EyeOff className="h-5 w-5 text-white" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg>
                      // <Eye className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                <div className="flex justify-center items-center w-full">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white w-[100px] h-[40px] rounded-md shadow-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="relative flex flex-col justify-center items-center space-y-4 mt-6">
                <div className="text-sm flex font-semibold">
                  Don't have an Account?
                  <span
                    onClick={() => setClicked("2")}
                    className="cursor-pointer text-blue-700 ml-1 hover:text-blue-900"
                  >
                    Register
                  </span>
                </div>
                <span
                  className="text-sm text-blue-700 cursor-pointer hover:text-blue-900 font-semibold"
                  onClick={() => setClicked("1")}
                >
                  Sign in
                </span>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="float-right bg-primary-100 border-2 rounded-l-sm  w-1/2 h-screen grid items-start sm:items-center justify-items-center">
        <div className="text-white flex flex-col item-center justify-center">
          <div className="font-bold text-[20px] sm:text-[3rem] h-fit text-center px-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 -1000 960 960" fill="#ffffff"
              className=" w-[120px] h-[120px] sm:w-[54px] sm:h-[54px]">
              <path d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z" />
            </svg>
            <span className="">Ledger App</span>
          </div>
          <h6 className="italic mt-2 text-[10px] sm:text-base">...documenting your business, faster</h6>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
