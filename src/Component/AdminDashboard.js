import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { AuthContext } from '../Context/auth'
import { toast } from 'react-toastify';
import axios from 'axios'

function AdminDashboard() {
const initialValue = 0
const approvedTime = Date.now()
const timer = Date.now()
// const dispatch = useDispatch()
// const { renew, setRenew } = useContext(AuthContext)
const [client, setClient] = useState([])
const [clientDetail, setClientDetail] = useState()
const [time, setTime] = useState(initialValue)
const [renew, setRenew] = useState(false)
// const [error, setError] = useState(null)
const baseUrl = "http://localhost:8080/account/getaccount"




//this gets data from the database once the page loads. This will be cut out and used at the creditor, debtors page
useEffect(()=> {
  axios.get(baseUrl).then((response) => {
    // console.log(response)
    setClient(() => response.data.allAccount)
  }).catch(error => {
    //  setError(error)
    console.log(error)
  })

  // if(timer > time){
  //   console.log("time up")
  // } else {
  //   axios.get(baseUrl).then((response) => {
  //     console.log(response)
  //     setClient(() => response.data.allAccount)
  //   }).catch(error => {
  //     //  setError(error)
  //      console.log(error)
  //   })
  // }
}, [timer, time])



//this reloads the time once it is clicked, the time is then kept in redux or context so that it will help control the fetching of data from DB
const renewTimerHandler = (id) => {
  console.log(id)
  const baseUrl2 = `http://localhost:8080/account/${id}`
  const f = client.filter((example) => example._id ===id)[0]
  console.log(f, "see me")
  let updateDetail = {...f}    //this copies the object
  updateDetail.verification = !f.verification   //this toggles the verification status
  updateDetail.approval = approvedTime
  console.log(updateDetail, typeof updateDetail.approval)

  try{
    axios.put(baseUrl2, updateDetail).then((response) => {
      console.log(response)
      toast.success("Successfully saved")
    })
  } catch (err) {
    console.log(err.message)
  }
  // setClientDetail(f)
  // setRenew(!renew)
  // setRenew(client.filter((example) => (example._id === id)))  //this one picks the individual client that was clicked
  // return (setTime(Date.now() + 2592000000))
}

const saveHandle = () => {
 setClientDetail(...clientDetail, clientDetail.verification = renew)
}
// console.log(renew[0]._id)   //this gives you only the id of the clicked client

//this deletes the subscription time
const deleteTimerHandler = (id) => {
  // console.log("renew clicked", timer)
  // if(timer > 1703873420789){
  //   setTime(true)
  //   // console.log("cut", time)
  // } else{
  //   setTime(false)
  //   // console.log(time)
  // }
}

// console.log(error)
  const render = client.map((item, id) => {
     return (<div key={item.id} className='flex w-screen h-14  m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
    <div className='flex gap-5'>
        <div>{item.businessName}</div>
        <div>{item.email}</div>
        <div>{item.fullName}</div>
    </div>
    <div className='ml-20 float-right'>
        <button className='float-right ml-2 h-10 w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500 hover:text-black hover:scale-90 duration-300 hover:font-bold' onClick={() => deleteTimerHandler(item.id)}>Delete</button>
        <button className='float-right h-10 w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500 hover:text-black hover:scale-90 duration-300 hover:font-bold' onClick={() => renewTimerHandler(item._id)}>Renew</button>
       </div>
     </div>)
  })



  return (
    <div>
      <div className='h-24 bg-gray-100 text-black text-5xl rounded-md shadow-xl hover:shadow content-center flex flex-wrap justify-center'>
        This is Admin Dashboard
      </div>
      <div>
      {/* {error ? error.message :render} */}
      {render}
      </div>
      <button className='float-right h-10 w-36 bg-blue-400 text-white rounded-xl hover:bg-gray-500 hover:text-black hover:scale-90 duration-300 hover:font-bold' onClick={() => saveHandle()}>Save</button>
      {/* <button onClick={renewTimerHandler}>click</button> */}
    </div>
  )
}

export default AdminDashboard
