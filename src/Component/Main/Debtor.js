import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import DeleteModal from '../../Utilities/DeleteModal'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { toast } from 'react-toastify'
import { useAuth } from '../../Context/auth'
import UpdateModal from '../../Utilities/UpdateModal'
import { baseUrl } from '../../Utilities/helper'

function Debtor() {
  const [client, setClient] = useState([])
  const { accountId } = useParams()
  const auth = useAuth()
  const { fullName, businessName } = auth.user
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [deleteId, setDeleteId] = useState("")
  const [updateId, setUpdateId] = useState("")
  const [debtorUpdate, setDebtorUpdate] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
    address: ""
  })
  const baseUrlxx = baseUrl + "/debtor"


  useEffect(() => {
    axios.get(baseUrlxx).then((response) => {
      const debtorDetails = response.data.debtors
      if (debtorDetails.length === 0) {
        setError(<div className='relative top-60 left-80 text-3xl font-bold'>There is no creditor record here</div>)
      } else {
        setClient(debtorDetails)
      }
      // setClient(() => response.data.allAccount)
    }).catch(error => {
      setError(error)
    })
  }, [baseUrlxx])


  const submitHandler = (e, id) => {
    e.preventDefault()
    // setDeleteId({...deleteId, name: name})  this is supposed to copy the prev content and change only a part of the object

    const deleteData = {
      id: deleteId,
      password,
      accountId
    }
    /////////////////////////////////////send to the backend where the logic is to be done
    if (deleteData.length !== 0) {
      const deleteUrl = baseUrl + `/debtor/${accountId}/${password}/${deleteId}`
      axios.delete(deleteUrl, deleteData).then((response) => {
        toast.success(response.data.message)
        window.location.reload()
      })
        .catch(error => {
          console.log(error)
          toast.error("You are not authorized to do this")
        })
      setShowDeleteModal(false)
    } else {
      setShowDeleteModal(false)
    }
    setPassword("")
  }

  ///////////////This is to delete the debtor by only the owner
  const deleteDebtorHandler = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  /////////////////////This is for the Update button/////////
  const updateDebtor = (id) => {
    setUpdateId(id)
    setShowUpdateModal(true)
  }

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setDebtorUpdate({
      ...debtorUpdate,
      [name]: value,
      createdBy: accountId
    })
  }

  function onSubmitDebtorUpdateHandler(e) {
    e.preventDefault()
    try {
      axios.put(baseUrl + `/${updateId}`, debtorUpdate)
        .then((response) => {
          toast.success(response.data.message)
          window.location.reload()
        })
    } catch (error) {
      console.error("Error in trying to send updated debtor to the backend", error)
    }

    setShowUpdateModal(false)
    setDebtorUpdate({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      businessName: "",
      address: ""
    })
    setUpdateId("")
  }

  ///////////////////////////////////////////////////////////////

  const render = client.map((item, id) => {
    return (<div key={item.id} className='flex w-screen h-14 mt-4 md:mt-0 m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
      <div className='flex gap-5'>
        <div>{item.firstName}</div>
        <div>{item.lastName}</div>
        <div>{item.phoneNumber}</div>
      </div>
      <div className='ml-20 float-right'>
        <button className='float-right ml-2 md:h-10 w-14 md:w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold'
          onClick={() => deleteDebtorHandler(item._id)}>
          Delete
        </button>
        <button className='float-right ml-2 md:h-10 w-14 md:w-36 bg-gray-500 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold'
          onClick={() => updateDebtor(item._id)}>
          Update
        </button>
        <Link to={`${item._id}`} state={item}><button className='
           float-right md:h-10 w-14 md:w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold'
        >Open</button></Link>
      </div>
    </div>)
  })
  return (
    <div>
      <NavBar classStyle='fixed grid w-[100%] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center' />
      <Header pageTitle={" Debtor Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[103vw] md:w-[100vw] flex' />
      <div>
        {error ? error : render}
      </div>
      <DeleteModal visible={showDeleteModal} close={() => setShowDeleteModal(false)}>
        <form onSubmit={submitHandler}>
          <input
            placeholder='put in your password here'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='absolute flex left-10 md:left-20 rounded-[10px] w-3/4 border-2 p-1 top-10 pl-7'
          />
          <button className='absolute deletebtn w-[7em] md:w-[14em] top-[6rem] left-[6em] md:left-[9em] grid justify-items-center justify-self-center'>Enter</button>
        </form>
      </DeleteModal>
      <UpdateModal visible={showUpdateModal} close={() => setShowUpdateModal(false)}>
        <form className='grid justify-center' onSubmit={onSubmitDebtorUpdateHandler}>
          <input className='btn3' type='text' placeholder='Enter First Name' name='firstName' value={debtorUpdate.firstName} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Last Name' name='lastName' value={debtorUpdate.lastName} onChange={onChange} />
          <input className='btn3' type='Number' placeholder='Enter Phone Number' name='phoneNumber' value={debtorUpdate.phoneNumber} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Business Name' name='businessName' value={debtorUpdate.businessName} onChange={onChange} />
          <input className='btn3' type='text' placeholder='Enter Address' name='address' value={debtorUpdate.address} onChange={onChange} />
          <button className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
        </form>
      </UpdateModal>
    </div>
  )
}

export default Debtor
