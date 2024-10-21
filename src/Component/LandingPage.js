import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/auth";
import { baseUrl } from "../Utilities/helper";
import axios from "axios";
import { toast } from "react-toastify";

function LandingPage() {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState("");
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
        email: "",
        password: "",
      });
    } else {
      setRegisterError("Please register Now 😡😡😠😡😡");
      setIsRegister({
        fullName: "",
        businessName: "",
        phoneNumber: "",
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
    // console.log(isSigneIn)
    /////////////////this sends data to the back for signin
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
            <div
              className={
                clicked === "1"
                  ? "signIn"
                  : setErrorText("")
              }
            >
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
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  value={isSigneIn.password}
                  onChange={onChange}
                />
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
              className={
                clicked === "2"
                  ? "register"
                  : setRegisterError("")
              }
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
                  type="email"
                  placeholder="Email Address"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={isRegister.email}
                  onChange={onRegister}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  value={isRegister.password}
                  onChange={onRegister}
                />

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
            <div
              className={
                clicked === "3"
                  ? "forgetP"
                  : setForgetError("")
              }
            >
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
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  value={forget.password}
                  onChange={onForget}
                />
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

      <div className="float-right bg-primary-100 border-2 rounded-l-sm  w-1/2 h-screen grid items-center justify-items-center">
        <div className="absolute font-ms text-primary-100 text-9xl font-black flex top-1 left-1  md:relative md:text-white">
          J{" "}
          <div className="text-8xl block -left-3 top-3 relative">
            kl
            <span className="text-2xl relative -top-5 left-1 block">
              stores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
